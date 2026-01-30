import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Card, Typography, Tag, Spin, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'; // Thư viện xử lý ngày tháng (thường có sẵn hoặc dùng new Date)

const { Title } = Typography;

const ContactManager = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load danh sách liên hệ
    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await axios.get('/api/contacts');
            // Sắp xếp tin nhắn mới nhất lên đầu
            const sortedData = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setContacts(sortedData);
        } catch (error) {
            console.error("Lỗi tải tin nhắn:", error);
            message.error("Không thể tải danh sách liên hệ!");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Ngày gửi',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
            render: (text) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : 'Mới',
        },
        {
            title: 'Họ tên',
            dataIndex: 'name',
            key: 'name',
            width: 180,
            render: (text) => <b>{text}</b>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            render: (text) => <a href={`mailto:${text}`} style={{ color: '#1677ff' }}>{text}</a>,
        },
        {
            title: 'Nội dung tin nhắn',
            dataIndex: 'message',
            key: 'message',
            render: (text) => (
                <div style={{ whiteSpace: 'pre-wrap', maxHeight: '100px', overflowY: 'auto' }}>
                    {text}
                </div>
            ),
        },
    ];

    return (
        <Card>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <MailOutlined style={{ fontSize: 24, marginRight: 10, color: '#f56a00' }} />
                <Title level={3} style={{ margin: 0 }}>Hộp thư Liên hệ</Title>
            </div>
            
            <Table 
                dataSource={contacts} 
                columns={columns} 
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                bordered
            />
        </Card>
    );
};

export default ContactManager;