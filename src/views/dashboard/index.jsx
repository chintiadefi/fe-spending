import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Checkbox, Divider, Typography } from 'antd';
import { NavLink } from 'react-router-dom';
import dayjs from '../../utils/moment';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './index.module.css';

const { Title, Paragraph } = Typography;

const Dashboard = () => {
    const [form] = Form.useForm();

    const [jobList, setJobList] = useState([]);
    const [arrayJobList, setArrayJobList] = useState([]);
    const [payload, setPayload] = useState({page: 1});
    const [isLoading, setIsLoading] = useState(false);

    const getListJobs = ({ description = '', location = '', full_time = false, page = 1 }) => {
        setIsLoading(true);
        fetch(`https://dev6.dansmultipro.com/api/recruitment/positions.json?description=${description.toLocaleLowerCase()}&location=${location.toLocaleLowerCase()}&full_time=${full_time}&page=${page}`, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((response) => {
                const data = response.filter(item => item !== null);
                setJobList(data);
            })
            .catch((error) => console.log(error));
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    useEffect(() => {
        getListJobs({});
    }, []);

    useEffect(() => {
        if (payload.page === 1) {
            setArrayJobList(jobList);
        } else {
            setArrayJobList(arrayJobList.concat(jobList));
        };
    }, [jobList]);

    const onFilter = (filter) => {
        const payloadObj = {
            ...filter,
            page: 1,
        };
        setPayload(payloadObj);
        getListJobs(payloadObj);
    };

    const onLoad = () => {
        const payloadObj = {
            ...payload,
            page: payload.page + 1,
        };

        setPayload(payloadObj);
        getListJobs(payloadObj);
    };

    return (
        <div className='my-4 mx-8'>
            <Form className='flex items-end justify-center' form={form} name='filter_jobs' layout='inline' labelWrap onFinish={onFilter}>
                <Form.Item className={styles['form-item']} name='description' label='Job Description'>
                    <Input placeholder='Filter by title, benefits, companies, expertise' />
                </Form.Item>
                <Form.Item className={styles['form-item']} name='location' label='Location'>
                    <Input placeholder='Filter by city, state, zip code, country' />
                </Form.Item>
                <Form.Item name='full_time' label='Full Time Only' valuePropName="checked">
                    <Checkbox />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" type='primary'>Search</Button>
                </Form.Item>
            </Form>
            <Title level={2}>{payload.description || payload.location || payload.full_time ? `Showing ${arrayJobList.length} jobs` : 'Job List'}</Title>
            <Divider />
            {
                arrayJobList.map((items, index) => {
                    return (
                        <div key={index}>
                            <div className='flex justify-between'>
                                <div>
                                    <NavLink to={`/${items.id}`}><Title className='mt-0 mb-2 text-blue-700' level={4}>{items?.title}</Title></NavLink>
                                    <Paragraph>{items?.company} - <b className='text-green-500'>{items?.type}</b></Paragraph>
                                </div>
                                <div>
                                    <Paragraph className='text-right font-semibold'>{items?.location}</Paragraph>
                                    <Paragraph className='text-right text-gray-400'>{dayjs().to(dayjs(items?.created_at))}</Paragraph>
                                </div>
                            </div>
                            {index !== arrayJobList.length - 1 && <Divider className='mt-1 mb-2' />}
                        </div>
                    );
                })
            }
            {
                isLoading && 
                <div className='w-full flex justify-center text-xl'>
                    <LoadingOutlined />
                </div>
            }
            {(arrayJobList.length % 10 === 0 && arrayJobList.length > 0) && <Button className='mt-4 mb-2 w-full' type='primary' onClick={onLoad}>More Jobs</Button>}
        </div>
    );
}

export default Dashboard;
