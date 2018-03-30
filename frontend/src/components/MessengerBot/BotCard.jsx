import React from 'react';
import Card from '../Card/Card';
import {Col} from 'react-bootstrap';

const BotCard = (props) => {
    return (
        <div className="col-md-3 uk-flex">
            <Card

                title={props.title}
                content={
                    <div>
                        <strong>page_uuid:</strong>
                        <span>{props.page_uuid}</span>
                    </div>
                }
            />
        </div>
    );
}

export default BotCard;
