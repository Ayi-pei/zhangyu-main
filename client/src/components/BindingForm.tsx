import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import './BindingForm.css';

interface BindingFormProps {
  bindingCardNumber: string;
  setBindingCardNumber: React.Dispatch<React.SetStateAction<string>>;
  bindingBank: string;
  setBindingBank: React.Dispatch<React.SetStateAction<string>>;
  bindingExchangeCode: string;
  setBindingExchangeCode: React.Dispatch<React.SetStateAction<string>>;
  bindingCardHolder: string;
  setBindingCardHolder: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  userBalance: number; // 当前用户积分余额
  setUserBalance: React.Dispatch<React.SetStateAction<number>>; // 设置用户积分余额的函数
}

const BindingForm: React.FC<BindingFormProps> = ({
  bindingCardNumber,
  setBindingCardNumber,
  bindingBank,
  setBindingBank,
  bindingExchangeCode,
  setBindingExchangeCode,
  bindingCardHolder,
  setBindingCardHolder,
  onSubmit,
  userBalance,
  setUserBalance
}) => {
  const navigate = useNavigate();
  const [isCardBound, setIsCardBound] = useState(false);
  const [exchangeAmount, setExchangeAmount] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showExchangeForm, setShowExchangeForm] = useState(false);
  const [status, setStatus] = useState<{ type: string; message: string }>({ type: '', message: '' });
  const [showHistory, setShowHistory] = useState(false); // 控制历史记录显示

  // 请求获取用户已绑定银行卡信息
  useEffect(() => {
    fetch('/api/card-info')
      .then(res => res.json())
      .then(data => {
        if (data?.cardNumber) {
          setBindingCardNumber(data.cardNumber);
          setBindingBank(data.bank);
          setBindingCardHolder(data.cardHolder);
          setIsCardBound(true);
        }
      })
      .catch(err => {
        console.error('获取绑卡信息失败:', err);
      });
  }, [setBindingCardNumber, setBindingBank, setBindingCardHolder]);

  // 通用表单提交函数
  const submitForm = useCallback((url: string, body: object, onSuccess: () => void) => {
    setStatus({ type: '', message: '' });
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          onSuccess();
          setStatus({ type: 'success', message: data.message || '操作成功' });
        } else {
          setStatus({ type: 'error', message: data.message || '操作失败，请重试' });
        }
      })
      .catch(err => {
        console.error('错误:', err);
        setStatus({ type: 'error', message: '操作过程中出现错误，请稍后重试' });
      });
  }, []);

  const handleBindCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bindingCardNumber || !bindingBank || !bindingExchangeCode || !bindingCardHolder) {
      setStatus({ type: 'error', message: '请填写完整的银行卡信息' });
      return;
    }
    submitForm('/api/bind-card', {
      cardNumber: bindingCardNumber,
      bank: bindingBank,
      cardHolder: bindingCardHolder,
      exchangeCode: bindingExchangeCode
    }, () => {
      setIsCardBound(true);
      onSubmit();
    });
  };

  const handleExchangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCardBound) {
      setStatus({ type: 'error', message: '请先绑定银行卡' });
      return;
    }

    const points = parseInt(exchangeAmount);
    if (isNaN(points) || points <= 0) {
      setStatus({ type: 'error', message: '请输入有效的兑换积分数量' });
      return;
    }

    if (points > userBalance) {
      setStatus({ type: 'error', message: '积分不足，无法兑换' });
      return;
    }

    submitForm('/api/exchange', { exchangeAmount: points, verificationCode }, () => {
      setUserBalance(prevBalance => prevBalance - points); // 减少用户积分余额
      setExchangeAmount('');
      setVerificationCode('');
    });
  };

  const handleHistoryToggle = () => {
    setShowHistory(prev => !prev);
  };

  return (
    <div className="binding-container">
      <button type="button" onClick={() => navigate('/profile')} className="back-button">
        <ArrowLeft className="w-5 h-5" />
        <span>返回个人中心</span>
      </button>

      <div className="binding-card">
        <h2 className="binding-title">{isCardBound ? '银行卡管理' : '绑定银行卡'}</h2>

        {status.type && (
          <div className={`${status.type}-message`}>
            <AlertCircle className="w-5 h-5" />
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleBindCardSubmit}>
          <div className="form-group">
            <label htmlFor="cardNumber">银行卡号</label>
            <input
              id="cardNumber"
              type="text"
              value={bindingCardNumber}
              onChange={(e) => setBindingCardNumber(e.target.value)}
              placeholder="请输入银行卡号"
              disabled={isCardBound}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bank">开户银行</label>
            <input
              id="bank"
              type="text"
              value={bindingBank}
              onChange={(e) => setBindingBank(e.target.value)}
              placeholder="请输入开户银行"
              disabled={isCardBound}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cardHolder">持卡人姓名</label>
            <input
              id="cardHolder"
              type="text"
              value={bindingCardHolder}
              onChange={(e) => setBindingCardHolder(e.target.value)}
              placeholder="请输入持卡人姓名"
              disabled={isCardBound}
            />
          </div>

          {!isCardBound && (
            <div className="form-group">
              <label htmlFor="exchangeCode">兑换码</label>
              <input
                id="exchangeCode"
                type="text"
                value={bindingExchangeCode}
                onChange={(e) => setBindingExchangeCode(e.target.value)}
                placeholder="请设置兑换码"
              />
            </div>
          )}

          {!isCardBound && (
            <button type="submit" className="submit-button">
              确认绑定
            </button>
          )}
        </form>

        {isCardBound && (
          <div className="exchange-section">
            <button type="button" onClick={() => setShowExchangeForm(!showExchangeForm)} className="toggle-exchange-button">
              {showExchangeForm ? '隐藏兑换表单' : '积分兑换'}
            </button>

            {showExchangeForm && (
              <form onSubmit={handleExchangeSubmit} className="exchange-form">
                <div className="form-group">
                  <label htmlFor="exchangeAmount">兑换积分</label>
                  <input
                    id="exchangeAmount"
                    type="number"
                    value={exchangeAmount}
                    onChange={(e) => setExchangeAmount(e.target.value)}
                    placeholder="请输入要兑换的积分数量"
                    min="1"
                  />
                  <small className="exchange-rate">兑换比例：10积分 = 1韩元</small>
                </div>

                <div className="form-group">
                  <label htmlFor="verificationCode">兑换码验证</label>
                  <input
                    id="verificationCode"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="请输入兑换码"
                  />
                </div>

                <button type="submit" className="exchange-button">
                  确认兑换
                </button>
              </form>
            )}
          </div>
        )}

        <button onClick={handleHistoryToggle} className="history-button">
          {showHistory ? '隐藏积分历史' : '查看积分历史'}
        </button>

        {showHistory && (
          <div className="history-section">
            <h3>积分历史</h3>
            {/* 显示用户的积分历史记录 */}
            <ul>
              <li>2025-02-25: 兑换 100积分</li>
              <li>2025-02-20: 兑换 50积分</li>
              {/* 更多历史记录 */}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BindingForm;
