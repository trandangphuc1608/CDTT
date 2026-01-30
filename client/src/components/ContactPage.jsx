import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Button, Row, Col, Typography, Card, message } from "antd";
import { SendOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const ContactPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post("/api/contacts", values);
      message.success("Tin nhắn của bạn đã được gửi thành công!");
      form.resetFields();
    } catch (error) {
      console.error("Lỗi gửi liên hệ:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", paddingBottom: "50px" }}>
      {/* Banner */}
      <div style={{ 
          background: 'url("https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2070")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
      }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}></div>
          <Title style={{ color: 'white', position: 'relative', zIndex: 1, fontSize: '48px', textTransform: 'uppercase' }}>
              Liên Hệ
          </Title>
      </div>

      <div className="container" style={{ maxWidth: "1200px", margin: "-50px auto 0", padding: "0 20px", position: "relative", zIndex: 2 }}>
        <Row gutter={[24, 24]}>
          {/* Cột Thông tin */}
          <Col xs={24} md={8}>
            <Card style={{ height: "100%", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", background: "#1f2937", color: "white", border: "none" }}>
              <Title level={3} style={{ color: "#f5a623", marginBottom: "30px" }}>Thông tin liên hệ</Title>
              
              <div style={{ marginBottom: "25px", display: "flex", alignItems: "flex-start" }}>
                <EnvironmentOutlined style={{ fontSize: "24px", color: "#f5a623", marginRight: "15px", marginTop: "5px" }} />
                <div>
                  <Text strong style={{ color: "white", fontSize: "16px", display: "block" }}>Địa chỉ</Text>
                  <Text style={{ color: "#ccc" }}>Ký túc xá Khu B, ĐHQG TP.HCM</Text>
                </div>
              </div>

              <div style={{ marginBottom: "25px", display: "flex", alignItems: "flex-start" }}>
                <PhoneOutlined style={{ fontSize: "24px", color: "#f5a623", marginRight: "15px", marginTop: "5px" }} />
                <div>
                  <Text strong style={{ color: "white", fontSize: "16px", display: "block" }}>Điện thoại</Text>
                  <Text style={{ color: "#ccc" }}>0123 456 789</Text>
                </div>
              </div>

              <div style={{ marginBottom: "25px", display: "flex", alignItems: "flex-start" }}>
                <MailOutlined style={{ fontSize: "24px", color: "#f5a623", marginRight: "15px", marginTop: "5px" }} />
                <div>
                  <Text strong style={{ color: "white", fontSize: "16px", display: "block" }}>Email</Text>
                  <Text style={{ color: "#ccc" }}>contact@tdpfood.com</Text>
                </div>
              </div>
            </Card>
          </Col>

          {/* Cột Form */}
          <Col xs={24} md={16}>
            <Card style={{ borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
              <Title level={3} style={{ marginBottom: "10px" }}>Gửi thắc mắc cho chúng tôi</Title>
              <Paragraph type="secondary" style={{ marginBottom: "30px" }}>
                Nếu bạn có bất kỳ câu hỏi hoặc đóng góp nào, đừng ngần ngại điền vào form dưới đây. Chúng tôi sẽ phản hồi sớm nhất có thể.
              </Paragraph>

              <Form layout="vertical" size="large" onFinish={onFinish} form={form}>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
                      <Input placeholder="Nguyễn Văn A" style={{ borderRadius: "8px" }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Email không hợp lệ" }]}>
                      <Input placeholder="email@example.com" style={{ borderRadius: "8px" }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="message" label="Nội dung tin nhắn" rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}>
                  <Input.TextArea rows={6} placeholder="Nhập nội dung cần hỗ trợ..." style={{ borderRadius: "8px" }} />
                </Form.Item>

                <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    icon={<SendOutlined />}
                    style={{ background: "#cf1322", borderColor: "#cf1322", height: "50px", padding: "0 40px", fontWeight: "bold", borderRadius: "8px" }}
                >
                  GỬI TIN NHẮN
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ContactPage;