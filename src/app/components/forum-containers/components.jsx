"use client";
import React, {useEffect, useState} from 'react';

import { Checkbox, TextField, FormControlLabel, Button, Select, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

// Ensure the SCSS variables are correctly imported
import variables from '../../styles/variables.module.scss';

import './_styles.scss';
import { isMobileDevice } from '@/app/utils/basicFuncs';
import { defineLightDark, lightenDarkenColor } from '@/app/utils/projectColors';

// Use the imported SCSS variables correctly
const defaultProps = {
  '& label.Mui-focused': {
    color: variables.primaryColor,
  },
  '& label': {
    color: variables.fontColor,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: variables.primaryColor,
  },
  '& .MuiOutlinedInput-root': {
    color: variables.fontColor,
    '& fieldset': {
      borderColor: variables.primaryColor,
    },
    '&:hover fieldset': {
      borderColor: variables.primaryColor,
    },
    '&.Mui-focused fieldset': {
      borderColor: variables.primaryColor,
    },
    '& .MuiInputBase-input': {
      color: variables.fontColor,
    },
  },
}

const classOptions = {
  letnik1: ['a', 'b', 'c', 'č', 'd'],
  letnik2: ['a', 'b', 'c', 'č', 'd', 'e'],
  letnik3: ['a', 'b', 'c', 'č', 'd', 'e'],
  letnik4: ['a', 'b', 'c', 'č', 'd'],
  noSKG: ['fa-icon>>', faCheck],
}

function InputField({ 
  className, valueType, placeholder, contSx, inputSx, title, onChange=()=>{}, defaultValue, specialValue="ime" 
}) {
  return (
    <div className={`main-cont-input ${className}`} style={{ ...contSx }}>
      <h3 style={{ color: variables.fontColor }}>{title}</h3>
      <TextField
        className={`text-field ${specialValue}`}
        sx={{ ...defaultProps, ...inputSx }}
        id="outlined-basic"
        variant="outlined"
        label={placeholder}
        type={valueType}
        onChange={(e) => onChange(e.target.value)}
        defaultValue={defaultValue}
      />
    </div>
  );
}

function ClassSelect({ className, valueType, placeholder, contSx, checkboxSx, title, onChange=()=>{}}) {
  const [visibleOption, setVisibleOption] = useState('letnik1');
  const [oddelek, setOddelek] = useState('a');

  useEffect(() => {
    onChange(visibleOption.replace('letnik', ''), oddelek[0]);
  }, [visibleOption, oddelek]);

  const checkboxDefaults = {
    '& .MuiSvgIcon-root': {
      fill: variables.primaryColor,
    }
  }

  return (
    <div className={`main-cont-class-select ${className}`} style={{ ...contSx }}>
      <h3 style={{ color: variables.fontColor }}>{title}</h3>
      <div className='div-select-class'>
        <div id='left-side'>
          {Object.keys(classOptions).map((key, index) => {
            const isChecked = key === visibleOption;
            return (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    sx={{ ...checkboxDefaults, ...checkboxSx }}
                    checked={isChecked}
                    onChange={(e) => setVisibleOption(key, e)}
                  />
                }
                label={key === 'noSKG' ? 
                  (isMobileDevice()? 'Ne obiskujem ŠKG':'Ne obiskujem Škofijske Klasične Gimnazije'):
                  key.replace('letnik', '') + '. letnik'
                }
              />
            );
          })}
        </div>
        <div id='vertical-separator' />
        <div id='right-side'>
          {classOptions[visibleOption].map((option, index) => {
            if (option === 'fa-icon>>') {
              return (
                <div key={index} className='class-option'>
                  <p>Tukaj ni nič za izpolniti 😁</p><br/>
                  <center>
                    <FontAwesomeIcon icon={classOptions['noSKG'][1]} color={variables.bgColorOpp} />
                  </center>
                </div>
              );
            } else if (option === faCheck) {
              return null;
            } else {
              const isChecked = option === oddelek;
              return (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      sx={{ ...checkboxDefaults, ...checkboxSx }}
                      checked={isChecked}
                      onChange={(e) => setOddelek(option.slice(oddelek.length - 1, oddelek.length))}
                    />
                  }
                  label={option}
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

function TextContainer({ className, title, description, children, useImg, imgSrc }) {
  return (
    <div className={`main-cont-text-container ${className}`}>
      <h1 style={{ color: variables.fontColor }}>{title}</h1>
      <p style={{ color: variables.fontColor }}>{description}</p>
      {children}
      {useImg && <img src={imgSrc} alt='img' />}
    </div>
  );
}

const defaultDropdownSX = {
  backgroundColor: lightenDarkenColor(defineLightDark(variables.bgAccent), 60),
  color: variables.fontColor,
  '& .MuiSelect-select': {
    backgroundColor: lightenDarkenColor(defineLightDark(variables.bgAccent), 60),
    color: variables.fontColor,
  },
  '& .MuiListItem-root': {
    backgroundColor: lightenDarkenColor(defineLightDark(variables.bgAccent), 60),
  },
  '&:hover': {
    backgroundColor: lightenDarkenColor(defineLightDark(variables.bgAccent), 40),
    color: variables.fontColor,
  },
  '&.Mui-selected': {
    backgroundColor: lightenDarkenColor(defineLightDark(variables.bgAccent), 60),
    color: variables.fontColor,
  },
  '&.Mui-selected:hover': {
    backgroundColor: lightenDarkenColor(defineLightDark(variables.bgAccent), 40),
    color: variables.fontColor,
  },
  '&.MuiListItem-root': {
    backgroundColor: variables.bgColor,
    color: variables.fontColor,
  },
  width: '200px',
};

const defaultSelectedItemSX = {
  backgroundColor: lightenDarkenColor(defineLightDark(variables.bgAccent), 20),
  color: variables.fontColor,
  '&:hover': {
    backgroundColor: lightenDarkenColor(defineLightDark(variables.bgAccent), 40),
    color: lightenDarkenColor(defineLightDark(variables.fontColor), -40),
  },
};

const menuProps = {
  PaperProps: {
    sx: {
      backgroundColor: lightenDarkenColor(defineLightDark(variables.bgAccent), 60),
      color: variables.fontColor,
    },
  },
};

function HoodieSelectBox({ className, data=null, useImg=false, index, onRemove=()=>{}, selectedData=null, onChangeSelect=()=>{} }) {
  if (!data && !selectedData) {
    return (
      <div className={`main-cont-hoodie-select ${className}`}>
        <center>
          <h1 style={{ color: variables.fontColor }}>Napaka pri nalaganju podatkov.</h1>
        </center>
      </div>
    )
  }

  const [hoodieImg, setHoodieImg] = useState(data.hoodieImages[selectedData.logoType][selectedData.color]);

  const handleChange = (key, val) => {
    let newItem = selectedData

    if (newItem[key]) {
      newItem[key] = val
    }

    setHoodieImg(data.hoodieImages[newItem.logoType][newItem.color]);
    onChangeSelect({
      size: newItem.size,
      color: newItem.color,
      logoType: newItem.logoType,
      quantity: newItem.quantity
    }, index)
  }

  return (
    <div className={`main-cont-hoodie-select ${className}`}>
      {useImg && <div id='left-side'>
        <img src={hoodieImg} alt="" />
      </div>}
      <div id='right-side' use-img={useImg? "true": "false"}>
        <div>
          <h3>Izberi si velikost puloverja</h3>
          <Select
            value={selectedData.size}
            onChange={(e) => handleChange("size", e.target.value)}
            sx={{ ...defaultDropdownSX }}
            MenuProps={menuProps}
          >
            {data.hoodieSizes.map((size, index) => (
              <MenuItem 
                key={index} 
                value={size} 
                sx={size === selectedData.size ? defaultSelectedItemSX : defaultDropdownSX}
              >
                {size}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div>
          <h3>Izberi si barvo puloverja</h3>
          <Select
            value={selectedData.color}
            onChange={(e) => handleChange("color", e.target.value)}
            sx={{ ...defaultDropdownSX }}
            MenuProps={menuProps}
          >
            {data.hoodieColors.map((color, index) => (
              <MenuItem 
                key={index} 
                value={color} 
                sx={color === selectedData.color ? defaultSelectedItemSX : defaultDropdownSX}
              >
                {color}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div>
          <h3>Izberi si logotip puloverja</h3>
          <Select
            value={selectedData.logoType}
            onChange={(e) => handleChange("logoType", e.target.value)}
            sx={{ ...defaultDropdownSX }}
            MenuProps={menuProps}
          >
            {data.hoodieLogos.map((logo, index) => (
              <MenuItem 
                key={index} 
                value={logo} 
                sx={logo === selectedData.logoType ? defaultSelectedItemSX : defaultDropdownSX}
              >
                {logo}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div>
          <h3>Izberi si količino puloverjev</h3>
          <Select
            value={selectedData.quantity}
            onChange={(e) => handleChange("quantity", e.target.value)}
            sx={{ ...defaultDropdownSX }}
            MenuProps={menuProps}
          >
            {data.hoodieQuantities.map((number, index) => (
              <MenuItem 
                key={index} 
                value={number} 
                sx={number === selectedData.quantity ? defaultSelectedItemSX : defaultDropdownSX}
              >
                {number}
              </MenuItem>
            ))}
          </Select>
        </div>
          
        <Button
          variant="contained"
          className='submit-btn'
          sx={{ 
            backgroundColor: variables.primaryColor,
            color: variables.fontColor,
            transition: 'all 0.3s',
            fontWeight: 'bold',
            fontSize: '1.2em',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: variables.secondaryColor,
              transform: 'scale(1.1)',
            }
          }}
          onClick={() => onRemove(index)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>

        {/* <Button
          variant="contained"
          className='submit-btn'
          sx={{ 
            backgroundColor: variables.primaryColor,
            color: variables.fontColor,
            transition: 'all 0.3s',
            fontWeight: 'bold',
            fontSize: '1.2em',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: variables.secondaryColor,
              transform: 'scale(1.1)',
            }
          }}
          onClick={() => submitResults({
            size: hoodieSize,
            color: hoodieColor,
            logo: logoType,
            name: data.name,
            class: data.class,
            oddelek: data.oddelek,
          })}
        >
          Dodaj
        </Button> */}
        {/* <p>{JSON.stringify(results)}</p> */}
        <p>{}</p>
      </div>
    </div>
  );
}

function HoodieSelection({ className, useImg=false, onChange=()=>{} }) {
  const [selectedData, setSelectedData] = useState([]);

  useEffect(()=>{
    onChange(selectedData)
  }, [selectedData])

  const defaultData = {
    hoodieColors: [
      'black', 
      'white', 
      'grey', 
      'blue', 
      'green', 
      'red', 
      'yellow', 
      'purple', 
      'pink',
    ],
    hoodieLogos: [
      'og', 
      'logo1',
      'logo2'
    ],
    hoodieImages: {
      og: {
        black : "https://uniformtailor.in/image/cache/catalog/data/Sweatshirts/hoodie/personalized-black-hoodie/personalized-black-hoodie-with-company-logo-670x760.jpg",
        white : "https://officialbrand.eu/imrankhanworld/wp-content/uploads/sites/4/2018/03/hoodie-white.png",
        grey  : "",
        blue  : "",
        green : "",
        red   : "",
        yellow: "",
        purple: "",
        pink  : ""
      },
      logo1: {
        black : "https://shopthestandard.com/cdn/shop/products/big_hoodie.jpg?v=1583621812",
        white : "https://shop.hardrock.com/dw/image/v2/BJKF_PRD/on/demandware.static/-/Sites-hardrock-master/default/dw94f7f69c/images/large/0886676308684_4.jpg?sw=800&sh=800",
        grey  : "",
        blue  : "",
        green : "",
        red   : "",
        yellow: "",
        purple: "",
        pink  : ""
      },
      logo2: {
        black : "https://static.wixstatic.com/media/c02b09_70cab98e47a54edeb0b60efae2ae57cc~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg",
        white : "https://www.aviatornation.com/cdn/shop/files/logo-pullover-relaxed-hoodie-white-hoodie-aviator-nation-610338.jpg?v=1716319796",
        grey  : "",
        blue  : "",
        green : "",
        red   : "",
        yellow: "",
        purple: "",
        pink  : ""
      }
    },
    hoodieSizes: [
      'XS', 'S', 'M', 'L', 'XL', 'XXL'
    ],
    hoodieQuantities: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    ]
  }
  const defaultHoodieSelect = {
    size: "XS",
    color: "black",
    logoType: "og",
    quantity: 1
  }

  return(
    <>
      {selectedData.map((item, index) => 
        <HoodieSelectBox
          key={index}
          useImg={useImg}
          selectedData={item}
          onChangeSelect={(e, index) => {
            let newList = []

            for (let i of selectedData) {
              newList.push(i)
            }

            newList[index] = e
            setSelectedData(newList)
          }}
          index={index}
          data={defaultData}
          onRemove={(index) => {
            let newList = []

            for (let i of selectedData) {
              if (i !== selectedData[index]) {
                newList.push(i)
              }
            }

            setSelectedData(newList)
          }}
        />
      )}
      <FontAwesomeIcon 
        icon={faPlusCircle} 
        className='plus-icon' 
        onClick={() => setSelectedData([...selectedData, defaultHoodieSelect])}
      />
    </>
  )
}

export {
  InputField,
  ClassSelect,
  TextContainer,
  HoodieSelectBox,
  HoodieSelection
}