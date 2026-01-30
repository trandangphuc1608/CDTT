import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, message, Popconfirm, Tag, Space } from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const VoucherManager = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State quản lý Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null); // Lưu voucher đang sửa
    
    const [form] = Form.useForm();

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/vouchers');
            setVouchers(res.data);
        } catch (error) {
            message.error('Lỗi tải dữ liệu!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    // Xử lý khi bấm nút "Lưu" trên Form
    const handleFinish = async (values) => {
        try {
            if (editingVoucher) {
                // --- TRƯỜNG HỢP SỬA ---
                await axios.put(`/api/vouchers/${editingVoucher.id}`, values);
                message.success('Cập nhật mã thành công!');
            } else {
                // --- TRƯỜNG HỢP THÊM MỚI ---
                await axios.post('/api/vouchers', values);
                message.success('Tạo mã mới thành công!');
            }
            
            // Reset và tải lại
            handleCancel();
            fetchVouchers();
        } catch (error) {
            message.error('Có lỗi xảy ra (Có thể trùng mã Code)!');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/vouchers/${id}`);
            message.success('Đã xóa!');
            fetchVouchers();
        } catch (error) {
            message.error('Lỗi khi xóa!');
        }
    };

    // Hàm mở Modal để SỬA
    const openEditModal = (record) => {
        setEditingVoucher(record);
        // Đổ dữ liệu vào form (Lưu ý: DatePicker cần object dayjs)
        form.setFieldsValue({
            code: record.code,
            discountPercent: record.discountPercent,
            expiryDate: record.expiryDate ? dayjs(record.expiryDate) : null
        });
        setIsModalOpen(true);
    };

    // Hàm mở Modal để THÊM MỚI
    const openCreateModal = () => {
        setEditingVoucher(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    // Đóng Modal và reset
    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingVoucher(null);
        form.resetFields();
    };

    const columns = [
        { 
            title: 'Mã Code', 
            dataIndex: 'code', 
            render: t => <Tag color="green" style={{fontSize: 14, fontWeight: 'bold'}}>{t}</Tag> 
        },
        { 
            title: 'Giảm giá', 
            dataIndex: 'discountPercent', 
            render: t => <span style={{color: 'red', fontWeight: 'bold'}}>{t}%</span> 
        },
        { 
            title: 'Hết hạn', 
            dataIndex: 'expiryDate', 
            render: t => t ? t : <Tag>Vô thời hạn</Tag> 
        },
        { 
            title: 'Hành động', 
            width: 150,
            render: (_, record) => (
                <Space>
                    {/* NÚT SỬA */}
                    <Button 
                        icon={<EditOutlined />} 
                        onClick={() => openEditModal(record)} 
                    />
                    
                    {/* NÚT XÓA */}
                    <Popconfirm title="Xóa mã này?" onConfirm={() => handleDelete(record.id)} okButtonProps={{ danger: true }}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div className="p-4 bg-white rounded shadow-sm h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold m-0">Quản lý Mã Giảm Giá</h3>
                <div className="flex gap-2">
                    <Button icon={<ReloadOutlined />} onClick={fetchVouchers}>Làm mới</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                        Tạo Mã Mới
                    </Button>
                </div>
            </div>

            <Table 
                dataSource={vouchers} 
                columns={columns} 
                rowKey="id" 
                loading={loading}
                bordered
            />
            
            <Modal 
                title={editingVoucher ? "Cập nhật Voucher" : "Tạo Voucher Mới"} 
                open={isModalOpen} 
                onCancel={handleCancel} 
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item 
                        name="code" 
                        label="Mã Code (VD: SALE50)" 
                        rules={[{ required: true, message: 'Vui lòng nhập mã!' }]}
                    >
                        <Input 
                            style={{ textTransform: 'uppercase' }} 
                            placeholder="Nhập mã..." 
                            disabled={!!editingVoucher} // Không cho sửa mã Code
                        />
                    </Form.Item>
                    
                    <Form.Item 
                        name="discountPercent" 
                        label="Phần trăm giảm (%)" 
                        rules={[{ required: true, message: 'Nhập số % giảm!' }]}
                    >
                        <InputNumber min={1} max={100} style={{ width: '100%' }} placeholder="VD: 10" />
                    </Form.Item>
                    
                    <Form.Item 
                        name="expiryDate" 
                        label="Ngày hết hạn (Để trống là vô thời hạn)"
                    >
                        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default VoucherManager;