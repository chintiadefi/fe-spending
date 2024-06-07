import React, { useEffect, useState } from 'react';
import { Typography, Divider, Row, Col, Card, Image } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { NavLink, useParams } from 'react-router-dom';
import classNames from 'classnames';
import styles from './index.module.css';

const { Text, Paragraph, Title, Link } = Typography;

const Detail = () => {
    let { id } = useParams();

    const [detail, setDetail] = useState();

    const getDetailJobs = () => {
        fetch(`https://dev6.dansmultipro.com/api/recruitment/positions/${id}`, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((response) => setDetail(response))
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        getDetailJobs({});
    }, []);

    return (
        <div className='my-4 mx-8'>
            <NavLink className='w-max flex' to='/'>
                <ArrowLeftOutlined />
                <Text className='ml-2 text-blue-500'>Back</Text>
            </NavLink>
            <Divider />
            <Paragraph className='mb-1 text-gray-400'>{detail?.type} / {detail?.location}</Paragraph>
            <Title className='mt-0 mb-2 font-bold' level={3}>{detail?.title}</Title>
            <Divider />
            <Row justify='space-between'>
                <Col span={17}>
                    <div dangerouslySetInnerHTML={{ __html: detail?.description }} />
                </Col>
                <Col span={6}>
                    <Card className={styles.card} title={detail?.company}>
                        <Image src={detail?.company_logo} preview={false} />
                        <Paragraph className='mt-4' ellipsis><Link href={detail?.company_url}>{detail?.company_url}</Link></Paragraph>
                    </Card>
                    <Card className={classNames('mt-6', styles.card)} title="How to apply">
                        <Paragraph><div dangerouslySetInnerHTML={{ __html: detail?.how_to_apply }} /></Paragraph>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Detail;
