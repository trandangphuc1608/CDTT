import React from 'react';
import { Typography } from 'antd';

const { Title, Text } = Typography;

export const Invoice = React.forwardRef(({ order, userName }, ref) => {
  if (!order) return null;

  return (
    <div ref={ref} style={{ padding: '20px', width: '300px', margin: '0 auto', fontFamily: 'monospace', background: '#fff' }}>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <Title level={4} style={{ margin: 0 }}>TDP RESTAURANT</Title>
        <Text style={{ fontSize: '12px' }}>ĐC: KTX Khu B, Dĩ An, Bình Dương</Text><br/>
        <Text style={{ fontSize: '12px' }}>Hotline: 0865.888.333</Text>
      </div>
      <hr style={{ borderTop: '1px dashed #000' }} />
      <div style={{ margin: '10px 0' }}>
        <Text strong>Hóa đơn: #{order.id}</Text><br/>
        <Text>Khách hàng: {userName || 'Khách lẻ'}</Text><br/>
        <Text>Ngày: {new Date(order.createdAt).toLocaleString()}</Text>
        <br/><Text>Trạng thái: {order.status}</Text>
      </div>
      <hr style={{ borderTop: '1px dashed #000' }} />
      <table style={{ width: '100%', fontSize: '12px' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Món</th>
            <th style={{ textAlign: 'center' }}>SL</th>
            <th style={{ textAlign: 'right' }}>Tiền</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={index}>
              <td style={{ textAlign: 'left' }}>{item.product.name}</td>
              <td style={{ textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right' }}>{(item.product.price * item.quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr style={{ borderTop: '1px dashed #000' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px' }}>
        <span>TỔNG CỘNG:</span>
        <span>{order.totalAmount?.toLocaleString()} đ</span>
      </div>
      <hr style={{ borderTop: '1px dashed #000' }} />
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <Text style={{ fontSize: '12px' }}>Cảm ơn quý khách & Hẹn gặp lại!</Text>
      </div>
    </div>
  );
});