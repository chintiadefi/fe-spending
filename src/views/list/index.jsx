import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Table, Divider } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import dayjs from '../../utils/moment';
import { totalArrayObjectData, formatNumberToRupiah } from '../../utils/format-text';
import { kategori } from '../../utils/kategori';

const { Title } = Typography;

const List = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const totalPengeluaran = totalArrayObjectData(data, 'jumlah');

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

    const columns = [
        {
          title: 'Nama Pengeluaran',
          dataIndex: 'nama'
        },
        {
          title: 'Tanggal',
          dataIndex: 'tanggal',
          render: (date) => <p>{dayjs(date).format('DD/MM')}</p>,
        },
        {
            title: 'Jumlah',
            dataIndex: 'jumlah',
            render: (amount) => <p>{formatNumberToRupiah(amount)}</p>,
        }
      ];

    return (
        <div>
          {
            loading ? 
            <div className='mt-14 flex justify-center'>
              <LoadingOutlined className='text-7xl' />
            </div>
            :
            <div>
              <Title>Daftar Pengeluaran</Title>
              {
                kategori.map((item, index) => {
                  const dataPengeluaran = data.filter(itemC => itemC.kategori === item);
                  if (dataPengeluaran.length > 0) return (
                    <div key={index} className='mt-8'>
                      <Title level={2}>{item.charAt(0).toUpperCase() + item.slice(1)}</Title>
                      <Table columns={columns} dataSource={dataPengeluaran} pagination={false} />
                      <Title level={4}>Total: {formatNumberToRupiah(totalArrayObjectData(dataPengeluaran, 'jumlah'))}</Title>
                      <Divider />
                    </div>
                  );
                })
              }
              <Title level={2}>Total Pengeluaran: {formatNumberToRupiah(totalPengeluaran)}</Title>
              <Title level={2}>Sisa Uang Bulanan: {formatNumberToRupiah(6000000 - totalPengeluaran)}</Title>
            </div>
          }
        </div>
    );
}

export default List;
