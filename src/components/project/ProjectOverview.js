import React from 'react';
import {Line} from 'react-chartjs-2';
import {Row, Col, Container} from 'reactstrap';

import styles from '../../styles/ProjectOverview.module.css';
import BoardDetail from './BoardDetail';

const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };


export const ProjectOverview = props => {
    return (
        <div className={styles.layoutContainer}>

            <div className={styles.mainContent}>
                <Container fluid>
                    <Row>
                        <div className="col-lg-8 col-md-12 col-sm-12 offset-lg-2">
                            <Line data={data} options={{maintainAspectRatio: true}}/>
                        </div>
                    </Row>

                    <Row style={{marginTop: '30px'}}>
                        {props.taskList.map((board, index) => <BoardDetail key={index} board={board.title} items={board.cards.length}/>)}
                    </Row>

                </Container>
                
            </div>
        </div>
    );
};