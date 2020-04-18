import React, { useState,  useEffect } from 'react';
import axios from 'axios';
import List from '../List/List';
import Badge from '../Badge/Badge';

import closeSvg from '../../assets/img/close.svg';
import addSvg from '../../assets/img/add.svg';
import './AddList.scss';


const AddList = ({ colors, onAdd }) => {
    const [visiblePopup, setVisiblePopup] = useState(false);
    const [selectedColor, selectColor] = useState(3);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      if(Array.isArray(colors)) {
        selectColor(colors[0].id);
      }
    }, [colors]);

    const onClose = () => {
      setInputValue('');
      selectColor(colors[0].id);
      setVisiblePopup(false);
    }

    const addNewList = () => {
      if(!inputValue) {
        alert('Введите название списка');
        return;
      }
      setIsLoading(true);
      axios.post('http://localhost:3001/lists', 
      { name: inputValue, colorId: selectedColor })
      .then(({ data }) => {
        const color = colors.filter(c => c.id === selectedColor)[0];
        const listObj = {...data, color, tasks: []}
        onAdd(listObj);
        onClose();
      })
      .catch(() => {
        alert('Ошибка при добавлении списка!')
      })
      .finally(() => {
        setIsLoading(false);
      }); 
    }

    const addMenuItem = [
        {
          className: 'list__add-button',
          icon: (<img src={addSvg} alt="Add list icon" className="add-svg" />),
          name: 'Добавить список'
        }
      ];

      return (
        <div className="add-list">
            <List click={() => setVisiblePopup(true)} items={addMenuItem} />
            {visiblePopup && (
              <div className="add-list__popup">
                <img
                  onClick={onClose}
                  src={closeSvg} 
                  alt="close icon" 
                  className="add-list__popup-close"
                />
                <input 
                  value={inputValue} 
                  onChange={ e => setInputValue(e.target.value) }
                  type="text" 
                  className="field" 
                  placeholder="Название списка" 
                />
                <ul className="add-list__circle-wrap">
                    {colors.map(item => (
                        <Badge
                          onClick={ () => {selectColor(item.id)}}
                          key={item.id}
                          color={item.name}
                          className={selectedColor === item.id && 'active'} 
                        />
                    ))}
                </ul>
                <button onClick={addNewList} className="button">
                  {isLoading ? 'Добавление...' : 'Добавить'}
                </button>
              </div>
            )}
        </div>
      )

}

export default AddList;