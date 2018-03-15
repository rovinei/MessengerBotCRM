import React from 'react';
import Card from '../Card/Card';
import {Col} from 'react-bootstrap';

const BotCard = (props) => {
    return (
        <Col md={3}>
            <Card
                title={props.title}
                content={
                    <div>
                        <strong>page_uuid:</strong>
                        <span>{props.page_uuid}</span>
                    </div>
                }
            />
        </Col>
    ); 
}

export default BotCard;