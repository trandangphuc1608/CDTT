import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Result, Button, Card } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const PaymentReturn = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState(null); // success | error

    useEffect(() => {
        // Lấy các tham số từ URL do VNPAY trả về
        const responseCode = searchParams.get('vnp_ResponseCode');
        
        // vnp_ResponseCode = '00' là thành công
        if (responseCode === '00') {
            setStatus('success');
            // GỌI API BACKEND ĐỂ CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG THÀNH "PAID" TẠI ĐÂY NẾU CẦN
        } else {
            setStatus('error');
        }
    }, [searchParams]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f5f5' }}>
            <Card style={{ width: 500, textAlign: 'center', borderRadius: 12 }}>
                {status === 'success' ? (
                    <Result
                        status="success"
                        title="Thanh toán thành công!"
                        subTitle="Cảm ơn bạn đã sử dụng dịch vụ. Đơn hàng đang được xử lý."
                        extra={[
                            <Button type="primary" key="home" onClick={() => navigate('/')}>
                                Về trang chủ
                            </Button>,
                            <Button key="history" onClick={() => navigate('/history')}>
                                Lịch sử đơn hàng
                            </Button>,
                        ]}
                    />
                ) : (
                    <Result
                        status="error"
                        title="Thanh toán thất bại"
                        subTitle="Giao dịch không thành công hoặc bị hủy. Vui lòng thử lại."
                        extra={[
                            <Button type="primary" key="retry" onClick={() => navigate('/menu')}>
                                Thử lại
                            </Button>,
                            <Button key="home" onClick={() => navigate('/')}>
                                Về trang chủ
                            </Button>,
                        ]}
                    />
                )}
            </Card>
        </div>
    );
};

export default PaymentReturn;