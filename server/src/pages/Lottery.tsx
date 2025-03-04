import React, { useState, useEffect } from 'react';
import { Card, Button, message, Row, Col, Spin, Typography, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

interface LotteryPrize {
  id: string;
  name: string;
  probability: number;
  image: string;
}

const Lottery: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [prizes, setPrizes] = useState<LotteryPrize[]>([]);
  const [result, setResult] = useState<LotteryPrize | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrizes();
  }, []);

  const fetchPrizes = async () => {
    try {
      const response = await axios.get('/api/lottery/prizes');
      setPrizes(response.data);
    } catch (error) {
      message.error('获取奖品列表失败');
    }
  };

  const handleDraw = async () => {
    setSpinning(true);
    setLoading(true);
    try {
      const response = await axios.post('/api/lottery/draw');
      setTimeout(() => {
        setResult(response.data);
        setSpinning(false);
        Modal.success({
          title: '抽奖结果',
          content: `恭喜获得: ${response.data.name}`,
          onOk: () => setResult(null)
        });
      }, 2000);
    } catch (error) {
      message.error('抽奖失败');
      setSpinning(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Title level={2} className="text-center mb-6">幸运抽奖</Title>
      
      <Row gutter={[16, 16]} justify="center">
        <Col span={24}>
          <Card className="text-center">
            <Spin spinning={spinning} size="large">
              <div className="grid grid-cols-3 gap-4">
                {prizes.map(prize => (
                  <Card
                    key={prize.id}
                    hoverable
                    cover={<img alt={prize.name} src={prize.image} />}
                  >
                    <Card.Meta
                      title={prize.name}
                      description={`中奖概率: ${prize.probability}%`}
                    />
                  </Card>
                ))}
              </div>
            </Spin>
            
            <Button
              type="primary"
              size="large"
              onClick={handleDraw}
              loading={loading}
              className="mt-6"
            >
              开始抽奖
            </Button>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={24}>
          <Card title="抽奖规则">
            <Text>
              1. 每次抽奖消耗100积分
              2. 每日限抽3次
              3. 中奖后请在24小时内领取奖品
              4. 积分不足时无法参与抽奖
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Lottery; 