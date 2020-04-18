import React from 'react';
import axios from 'axios';
import classNames from 'classnames';
import Badge from '../Badge/Badge';

import './List.scss';
import removeSvg from '../../assets/img/remove.svg';



const List = ({ items, isRemovable, click, onRemove, onClickItem, activeItem }) => {

    const removeList = (item) => {
        if(window.confirm('Вы действительно хотите удалить список?: ' + item.name)) {
            axios.delete('http://localhost:3001/lists/' + item.id).then(() => {
                onRemove(item.id);
            });
        }
    }

    return (
        <ul onClick={click} className="list">
            {
                items.map((item, index) => (
                    <li 
                        key={index}
                        className={classNames(item.className, 
                            {active: item.active ? 
                                item.active : 
                                activeItem && activeItem.id === item.id
                            }
                        )}
                        onClick={onClickItem ? () => onClickItem(item) : null}
                    >
                        <i>{ item.icon ? item.icon : <Badge color={item.color.name} /> }</i>
                        <span>
                            {item.name} 
                            {item.tasks && ` (${item.tasks.length})`}
                        </span>
                        {isRemovable && <img 
                            onClick={() => removeList(item)}
                            src={removeSvg} 
                            className="list__remove-icon" 
                            alt="remove icon"
                        />}
                    </li>
                ))
            }
        </ul>
    )
}

export default List;