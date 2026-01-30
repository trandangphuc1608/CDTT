import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, message, Popconfirm, Image, Upload } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const BannerManager = () => {
    const [banners, setBanners] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [form] = Form.useForm();

    const fetchBanners = async () => {
        try {
            const res = await axios.get('/api/banners');
            setBanners(res.data);
        } catch (error) {
            message.error('Lỗi tải banner!');
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleFinish = async (values) => {
        try {
            if (editingBanner) {
                await axios.put(`/api/banners/${editingBanner.id}`, values);
                message.success('Cập nhật thành công!');
            } else {
                await axios.post('/api/banners', values);
                message.success('Thêm banner mới thành công!');
            }
            fetchBanners();
            setIsModalOpen(false);
            form.resetFields();
            setEditingBanner(null);
        } catch (error) {
            message.error('Có lỗi xảy ra!');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/banners/${id}`);
            message.success('Đã xóa banner!');
            fetchBanners();
        } catch (error) {
            message.error('Lỗi khi xóa!');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', width: 60, align: 'center' },
        { 
            title: 'Hình ảnh', dataIndex: 'imageUrl', width: 150,
            render: (url) => <Image src={url} width={120} height={60} style={{objectFit: 'cover', borderRadius: 4}} />
        },
        { title: 'Tiêu đề', dataIndex: 'title', className: 'font-bold' },
        { 
            title: 'Trạng thái', dataIndex: 'isActive', 
            render: (active) => <Switch checked={active} disabled /> 
        },
        {
            title: 'Hành động',
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button icon={<EditOutlined />} onClick={() => {
                        setEditingBanner(record);
                        form.setFieldsValue(record);
                        setIsModalOpen(true);
                    }} />
                    <Popconfirm title="Xóa banner này?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 bg-white rounded shadow-sm h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold m-0">Quản lý Banner / Slider</h3>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingBanner(null); form.resetFields(); setIsModalOpen(true); }}>
                    Thêm Banner
                </Button>
            </div>
            
            <Table dataSource={banners} columns={columns} rowKey="id" bordered pagination={{ pageSize: 5 }} />

            <Modal
                title={editingBanner ? "Sửa Banner" : "Thêm Banner Mới"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ isActive: true }}>
                    <Form.Item name="title" label="Tiêu đề (Để hiển thị hoặc ghi chú)" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    {/* Upload Ảnh */}
                    <Form.Item label="Hình ảnh Banner (Nên chọn ảnh ngang)">
                        <Form.Item name="imageUrl" noStyle rules={[{ required: true, message: 'Cần có ảnh!' }]}>
                            <Input hidden />
                        </Form.Item>
                        <Upload
                            name="file"
                            action="/api/upload"
                            listType="picture"
                            maxCount={1}
                            onChange={(info) => {
                                if (info.file.status === 'done') {
                                    form.setFieldsValue({ imageUrl: info.file.response.url });
                                    message.success('Upload thành công!');
                                }
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item name="linkUrl" label="Link điều hướng (Không bắt buộc)">
                        <Input placeholder="/menu hoặc https://..." />
                    </Form.Item>

                    <Form.Item name="isActive" label="Hiển thị ngay?" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default BannerManager;