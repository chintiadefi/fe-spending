import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Slider, Row, Col, Button, Popconfirm, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { totalArrayObjectData } from '../../utils/format-text';
import { kategori } from '../../utils/kategori';

const { Title } = Typography;

const Analisis = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const getData = () => {
        setLoading(true);
        axios.get('https://db-spending.glitch.me/spending')
        .then(response => {
            setData(response.data);
          })
        setLoading(false);
      }
  
      useEffect(() => {
        getData();
      }, [])

    const resetAll = () => {
        setLoading(true);
        for (let i = 0; i < data.length; i++) {
            axios.delete(`https://db-spending.glitch.me/spending/${data[i].id}`)
            .then(function (res) {})
            .catch(function (error) {
            notification.err({
                message: 'Gagal me-reset data!'
            })
            });
        }
        setLoading(false);
    }

    return (
        <div>
            {
            loading ? 
            <div className='mt-14 flex justify-center'>
                <LoadingOutlined className='text-7xl' />
            </div>
            :
            <div className='m-5'>
                <Title>Analisis Pengeluaran</Title>
                {
                    kategori.map((item, index) => {
                        const dataPengeluaran = data.filter(itemC => itemC.kategori === item);
                        const presentase = totalArrayObjectData(dataPengeluaran, 'jumlah') / 6000000 * 100;
                        const rounded = Math.round((presentase + Number.EPSILON) * 100) / 100;
                        return (
                            <Row className='mt-6' key={index} align="middle">
                                <Col span={18}>
                                    <Title className='m-0' level={4}>{item.charAt(0).toUpperCase() + item.slice(1)}</Title>
                                    <Slider
                                        min={1}
                                        max={100}
                                        value={rounded}
                                    />
                                </Col>
                                <Col>
                                    <Title className='m-0' level={4}>{rounded}%</Title>
                                </Col>
                            </Row>
                        )
                    })
                }
                <Popconfirm
                    className='mt-20 w-1/3'
                    title="Reset Semua Data"
                    description="Apakah kamu yakin akan me-reset semua data?"
                    okText="Iya!"
                    cancelText="Batal"
                    onConfirm={resetAll}
                >
                    <Button danger>Reset Semua</Button>
                </Popconfirm>
            </div>
            }
        </div>
    );
}

export default Analisis;