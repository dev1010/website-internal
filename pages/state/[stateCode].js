import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Typography, Card, Spin, Space, Col, Row, Statistic } from 'antd'
import Layout from '../../components/layout'
import HistoryTable from '../../components/state/history-table'
import marked from 'marked'

const { Title } = Typography

export default () => {
  const [stateInfo, setStateInfo] = useState(false)
  const [history, setHistory] = useState(false)
  const [screenshots, setScreenshots] = useState(false)
  const router = useRouter()
  const { stateCode } = router.query

  useEffect(() => {
    if (!stateCode) {
      return
    }
    fetch(
      `https://covidtracking.com/api/v1/states/${stateCode.toLowerCase()}/info.json`,
    )
      .then((response) => response.json())
      .then((result) => {
        setStateInfo(result)
      })
      .catch((e) => {
        console.log(e)
      })
    fetch(`/api/state?state=${stateCode.toLowerCase()}`)
      .then((response) => response.json())
      .then((result) => {
        setHistory(result)
      })
      .catch((e) => {
        console.log(e)
      })
    fetch(
      `https://covidtracking.com/api/v1/states/${stateCode.toLowerCase()}/screenshots.json`,
    )
      .then((response) => response.json())
      .then((result) => {
        setScreenshots(result)
      })
      .catch((e) => {
        console.log(e)
      })
  }, [stateCode])

  return (
    <Layout title={stateInfo ? stateInfo.name : 'Loading...'}>
      {stateInfo !== false && (
        <>
          <Title>{stateInfo.name}</Title>
          <Row gutter={16} style={{ marginBottom: '2rem' }}>
            <Col span={6}>
              {stateInfo !== false && (
                <Card title="API links">
                  <p>
                    <strong>Live</strong>{' '}
                    <a
                      href={`https://covidtracking.com/api/v1/states/${stateCode}/daily.csv`}
                      target="_blank"
                    >
                      CSV
                    </a>{' '}
                    |{' '}
                    <a
                      href={`https://covidtracking.com/api/v1/states/${stateCode}/daily.json`}
                      target="_blank"
                    >
                      JSON
                    </a>
                  </p>
                  <p>
                    <strong>Preview</strong>{' '}
                    <a href={`/api/state?state=${stateCode}`} target="_blank">
                      JSON
                    </a>
                  </p>
                </Card>
              )}
            </Col>
            <Col span={18}>
              <Card title="Notes">
                {stateInfo.notes ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: marked(stateInfo.notes),
                    }}
                  />
                ) : (
                  <>No notes</>
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}
      <Card title="History">
        {history && screenshots ? (
          <HistoryTable
            history={history}
            screenshots={screenshots}
            state={stateCode}
          />
        ) : (
          <Space size="middle">
            <Spin size="large" />
          </Space>
        )}
      </Card>
    </Layout>
  )
}
