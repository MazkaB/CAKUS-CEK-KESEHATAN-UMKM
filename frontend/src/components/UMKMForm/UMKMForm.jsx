import React, { useState } from 'react';
import { Form, Input, Select, InputNumber, Button, Card, Row, Col, message, Steps } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { umkmService } from '../../services/umkmService';
import './UMKMForm.css';

const { Option } = Select;
const { Step } = Steps;

const UMKMForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const jenisUsahaOptions = [
    'Fashion', 'Jasa', 'Kesehatan', 'Makanan & Minuman', 
    'Pendidikan', 'Perdagangan', 'Perusahaan'
  ];

  const marketplaceOptions = [
    'Website Sendiri', 'Bukalapak', 'Lazada', 'Tokopedia', 'Shopee'
  ];

  const statusLegalitasOptions = ['Terdaftar', 'Belum Terdaftar'];

  const steps = [
    {
      title: 'Info Dasar',
      content: 'basic-info',
    },
    {
      title: 'Data Keuangan',
      content: 'financial-data',
    },
    {
      title: 'Data Operasional',
      content: 'operational-data',
    },
  ];

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await umkmService.createUMKM(values);
      message.success('Data UMKM berhasil disimpan!');
      
      // Redirect to health check
      const umkmId = response.data.data._id;
      message.info('Mengalihkan ke halaman analisis kesehatan...');
      
      setTimeout(() => {
        navigate(`/health-check/${umkmId}`);
      }, 1500);
      
    } catch (error) {
      message.error('Gagal menyimpan data UMKM');
      console.error('Error creating UMKM:', error);
    } finally {
      setLoading(false);
    }
  };

  const next = async () => {
    try {
      const values = await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Nama Usaha"
                  name="nama_usaha"
                  rules={[{ required: true, message: 'Nama usaha wajib diisi!' }]}
                >
                  <Input placeholder="Masukkan nama usaha" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Jenis Usaha"
                  name="jenis_usaha"
                  rules={[{ required: true, message: 'Jenis usaha wajib dipilih!' }]}
                >
                  <Select placeholder="Pilih jenis usaha">
                    {jenisUsahaOptions.map(jenis => (
                      <Option key={jenis} value={jenis}>{jenis}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Tahun Berdiri"
                  name="tahun_berdiri"
                  rules={[{ required: true, message: 'Tahun berdiri wajib diisi!' }]}
                >
                  <InputNumber
                    min={1990}
                    max={2025}
                    style={{ width: '100%' }}
                    placeholder="2020"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Status Legalitas"
                  name="status_legalitas"
                  rules={[{ required: true, message: 'Status legalitas wajib dipilih!' }]}
                >
                  <Select placeholder="Pilih status legalitas">
                    {statusLegalitasOptions.map(status => (
                      <Option key={status} value={status}>{status}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Tenaga Kerja Perempuan"
                  name="tenaga_kerja_perempuan"
                  rules={[{ required: true, message: 'Jumlah tenaga kerja perempuan wajib diisi!' }]}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    style={{ width: '100%' }}
                    placeholder="0"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Tenaga Kerja Laki-laki"
                  name="tenaga_kerja_laki_laki"
                  rules={[{ required: true, message: 'Jumlah tenaga kerja laki-laki wajib diisi!' }]}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    style={{ width: '100%' }}
                    placeholder="0"
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        );

      case 1:
        return (
          <>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Aset (IDR)"
                  name="aset"
                  rules={[{ required: true, message: 'Jumlah aset wajib diisi!' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="0"
                    formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/Rp\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Omset (IDR)"
                  name="omset"
                  rules={[{ required: true, message: 'Jumlah omset wajib diisi!' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="0"
                    formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/Rp\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Laba (IDR)"
                  name="laba"
                  rules={[{ required: true, message: 'Jumlah laba wajib diisi!' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="0"
                    formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/Rp\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Biaya Karyawan (IDR)"
                  name="biaya_karyawan"
                  rules={[{ required: true, message: 'Biaya karyawan wajib diisi!' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="0"
                    formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/Rp\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        );

      case 2:
        return (
          <>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  label="Kapasitas Produksi"
                  name="kapasitas_produksi"
                  rules={[{ required: true, message: 'Kapasitas produksi wajib diisi!' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="0"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Jumlah Pelanggan"
                  name="jumlah_pelanggan"
                  rules={[{ required: true, message: 'Jumlah pelanggan wajib diisi!' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="0"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Marketplace"
                  name="marketplace"
                  rules={[{ required: true, message: 'Marketplace wajib dipilih!' }]}
                >
                  <Select placeholder="Pilih marketplace">
                    {marketplaceOptions.map(marketplace => (
                      <Option key={marketplace} value={marketplace}>{marketplace}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="umkm-form">
      <Card title="Registrasi Data UMKM" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Steps current={currentStep} style={{ marginBottom: '24px' }}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="large"
        >
          {renderStepContent()}

          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            {currentStep > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={prev}>
                <ArrowLeftOutlined /> Sebelumnya
              </Button>
            )}
            
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                Selanjutnya <ArrowRightOutlined />
              </Button>
            )}
            
            {currentStep === steps.length - 1 && (
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
                size="large"
              >
                Simpan & Analisis
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default UMKMForm;