import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Tag, Space } from 'antd';
import { 
    PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, 
    SaveOutlined, CloseOutlined 
} from '@ant-design/icons';
import axios from 'axios';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [inventory, setInventory] = useState([]); 
    const [loading, setLoading] = useState(false);
    
    // State Modal Thêm/Sửa Món
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    
    // State Modal Công thức
    const [recipeModalOpen, setRecipeModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [recipeList, setRecipeList] = useState([]);
    
    // State Sửa Nguyên Liệu trong Công thức
    const [editingRecipeItem, setEditingRecipeItem] = useState(null);

    const [form] = Form.useForm();
    const [recipeForm] = Form.useForm(); 

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchInventory();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/products');
            setProducts(res.data);
        } catch (error) {
            message.error("Lỗi tải món ăn!");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try { const res = await axios.get('/api/categories'); setCategories(res.data); } catch (e) {}
    };

    const fetchInventory = async () => {
        try { const res = await axios.get('/api/ingredients'); setInventory(res.data); } catch (e) {}
    };

    // --- XỬ LÝ MÓN ĂN ---
    const handleSaveProduct = async (values) => {
        try {
            if (editingProduct) {
                await axios.put(`/api/products/${editingProduct.id}`, values);
                message.success("Cập nhật món thành công!");
            } else {
                await axios.post('/api/products', values);
                message.success("Thêm món mới thành công!");
            }
            fetchProducts();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error("Lỗi lưu sản phẩm!");
        }
    };

    const handleDeleteProduct = async (id) => {
        if(!window.confirm("Xóa món này?")) return;
        try { await axios.delete(`/api/products/${id}`); fetchProducts(); message.success("Đã xóa!"); } catch (e) { message.error("Lỗi xóa!"); }
    };

    // --- 👇 XỬ LÝ CÔNG THỨC (QUAN TRỌNG) 👇 ---

    const openRecipeModal = (product) => {
        setCurrentProduct(product);
        // Lấy danh sách từ productIngredients (Backend trả về)
        setRecipeList(product.productIngredients || []);
        setRecipeModalOpen(true);
        handleCancelEdit(); // Reset form sửa
    };

    const handleEditIngredient = (record) => {
        setEditingRecipeItem(record); 
        recipeForm.setFieldsValue({
            ingredientId: record.ingredient.id,
            quantity: record.quantityNeeded
        });
    };

    const handleCancelEdit = () => {
        setEditingRecipeItem(null);
        recipeForm.resetFields();
    };

    const handleAddOrUpdateIngredient = async (values) => {
        try {
            await axios.post(`/api/products/${currentProduct.id}/ingredients`, {
                ingredientId: values.ingredientId,
                quantity: values.quantity
            });
            
            message.success(editingRecipeItem ? "Đã cập nhật định lượng!" : "Đã thêm nguyên liệu!");
            handleCancelEdit();
            
            // Reload lại dữ liệu để cập nhật danh sách ngay lập tức
            const res = await axios.get('/api/products');
            setProducts(res.data);
            
            // Cập nhật lại list công thức đang hiển thị
            const updatedProduct = res.data.find(p => p.id === currentProduct.id);
            setRecipeList(updatedProduct.productIngredients || []); 

        } catch (error) {
            console.error(error);
            message.error("Lỗi lưu nguyên liệu!");
        }
    };

    const handleRemoveIngredient = async (ingredientId) => {
        try {
            await axios.delete(`/api/products/${currentProduct.id}/ingredients/${ingredientId}`);
            message.success("Đã xóa nguyên liệu!");
            
            if (editingRecipeItem?.ingredient?.id === ingredientId) {
                handleCancelEdit();
            }

            // Reload lại dữ liệu
            const res = await axios.get('/api/products');
            setProducts(res.data);
            
            // Cập nhật lại list công thức đang hiển thị
            const updatedProduct = res.data.find(p => p.id === currentProduct.id);
            setRecipeList(updatedProduct.productIngredients || []);

        } catch (error) {
            message.error("Lỗi xóa nguyên liệu!");
        }
    };

    // --- CỘT BẢNG MÓN ĂN ---
    const columns = [
        { title: 'Hình ảnh', dataIndex: 'imageUrl', align: 'center', render: url => <img src={url} alt="img" style={{width: 50, height: 50, objectFit: 'cover', borderRadius: 4}} /> },
        { title: 'Tên món', dataIndex: 'name', render: text => <b>{text}</b> },
        { title: 'Giá', dataIndex: 'price', render: val => val?.toLocaleString() + ' đ' },
        { 
            title: 'Công thức', 
            align: 'center',
            render: (_, record) => (
                <Button 
                    // Kiểm tra độ dài productIngredients để đổi kiểu nút
                    type={record.productIngredients && record.productIngredients.length > 0 ? "default" : "dashed"}
                    icon={<EyeOutlined />} 
                    onClick={() => openRecipeModal(record)}
                >
                    Công thức ({record.productIngredients?.length || 0})
                </Button>
            )
        },
        {
            title: 'Hành động',
            align: 'center',
            render: (_, record) => (
                <>
                    <Button icon={<EditOutlined />} onClick={() => { setEditingProduct(record); form.setFieldsValue(record); setIsModalOpen(true); }} style={{marginRight: 8}} />
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteProduct(record.id)} />
                </>
            )
        }
    ];

    // --- CỘT BẢNG CÔNG THỨC ---
    const recipeColumns = [
        { title: 'Nguyên liệu', render: r => <b>{r.ingredient?.name}</b> },
        { title: 'Định lượng cần', render: r => <Tag color="blue">{r.quantityNeeded} {r.ingredient?.unit}</Tag> },
        { 
            title: 'Hành động', 
            align: 'center',
            width: 120,
            render: (r) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} type="primary" ghost onClick={() => handleEditIngredient(r)} />
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleRemoveIngredient(r.ingredient.id)} />
                </Space>
            ) 
        }
    ];

    return (
        <div>
            <div style={{marginBottom: 16, display: 'flex', justifyContent: 'space-between'}}>
                <h2>Quản lý Món ăn</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingProduct(null); form.resetFields(); setIsModalOpen(true); }}>
                    Thêm món mới
                </Button>
            </div>

            <Table dataSource={products} columns={columns} rowKey="id" loading={loading} bordered />

            {/* Modal Thêm/Sửa Món ăn */}
            <Modal title={editingProduct ? "Sửa món" : "Thêm món"} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={form.submit}>
                <Form form={form} layout="vertical" onFinish={handleSaveProduct}>
                    <Form.Item name="name" label="Tên món" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="price" label="Giá bán" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item>
                    <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true }]}>
                        <Select options={categories.map(c => ({ label: c.name, value: c.id }))} />
                    </Form.Item>
                    <Form.Item name="imageUrl" label="Link ảnh"><Input /></Form.Item>
                    <Form.Item name="description" label="Mô tả"><Input.TextArea /></Form.Item>
                    <Form.Item name="isAvailable" label="Trạng thái"><Select options={[{label: 'Đang bán', value: true}, {label: 'Ngừng bán', value: false}]} /></Form.Item>
                </Form>
            </Modal>

            {/* MODAL QUẢN LÝ CÔNG THỨC */}
            <Modal
                title={`Công thức: ${currentProduct?.name || ''}`}
                open={recipeModalOpen}
                onCancel={() => setRecipeModalOpen(false)}
                footer={null}
                width={700}
            >
                <div style={{ marginBottom: 20, background: '#f5f5f5', padding: 15, borderRadius: 8, border: '1px solid #e0e0e0' }}>
                    <div style={{ marginBottom: 10, fontWeight: 'bold', color: editingRecipeItem ? '#1677ff' : '#333' }}>
                        {editingRecipeItem ? `✏️ Đang sửa: ${editingRecipeItem.ingredient?.name}` : '➕ Thêm nguyên liệu vào món:'}
                    </div>
                    
                    <Form form={recipeForm} layout="inline" onFinish={handleAddOrUpdateIngredient}>
                        <Form.Item name="ingredientId" rules={[{ required: true, message: 'Chọn NL' }]} style={{width: 220}}>
                            <Select 
                                placeholder="Chọn nguyên liệu" 
                                showSearch
                                optionFilterProp="label"
                                disabled={!!editingRecipeItem} 
                                options={inventory.map(ing => ({ label: `${ing.name} (${ing.unit})`, value: ing.id }))} 
                            />
                        </Form.Item>
                        <Form.Item name="quantity" rules={[{ required: true, message: 'Nhập số' }]}>
                            <InputNumber placeholder="Số lượng" min={0} step={0.01} style={{width: 120}} />
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    icon={editingRecipeItem ? <SaveOutlined /> : <PlusOutlined />}
                                    style={{ background: editingRecipeItem ? '#faad14' : '#1677ff' }}
                                >
                                    {editingRecipeItem ? "Cập nhật" : "Thêm"}
                                </Button>
                                
                                {editingRecipeItem && (
                                    <Button onClick={handleCancelEdit} icon={<CloseOutlined />}>
                                        Hủy
                                    </Button>
                                )}
                            </Space>
                        </Form.Item>
                    </Form>
                </div>

                <Table 
                    dataSource={recipeList}
                    // Key kết hợp id để tránh trùng lặp
                    rowKey={record => record.id || record.ingredient.id}
                    pagination={false}
                    size="small"
                    bordered
                    columns={recipeColumns}
                />
            </Modal>
        </div>
    );
};

export default ProductManager;