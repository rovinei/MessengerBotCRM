import React from 'react';
import Card from '../Card/Card';

const BotCard = (props) => {
	return (
		<div className="uk-flex">
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
