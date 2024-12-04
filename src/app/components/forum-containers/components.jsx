"use client";
import React, {useEffect, useState} from 'react';

import { Checkbox, TextField, FormControlLabel, Button, Select, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

// Ensure the SCSS variables are correctly imported
import variables from '../../styles/variables.module.scss';

import './_styles.scss';
import { isMobileDevice } from '../../utils/basicFuncs';
import { defineLightDark, lightenDarkenColor } from '../../utils/projectColors';

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
  prof: ['fa-icon-prof>>', faCheck]
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
                  key === 'prof'? 'Profesor' : (key.replace('letnik', '') + '. letnik')
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
            } else if (option === 'fa-icon-prof>>') {
              return (
                <div key={index} className='class-option'>
                  <p>Tukaj ni nič za izpolniti 😁</p><br/>
                  <center>
                    <FontAwesomeIcon icon={classOptions['prof'][1]} color={variables.bgColorOpp} />
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

  useEffect(() => {
    setHoodieSelectionColor(data[selectedData['color']]['hex']);
  }, [onRemove])

  const [hoodieSelectionColor, setHoodieSelectionColor] = useState(data[selectedData['color']]['hex']);

  const handleChange = (key, val) => {
    let newItem = selectedData

    console.log(key, val)

    if (newItem[key]) {
      if (key === 'color' && val === 'sky blue') {
        if (selectedData['size'] === 'S' || selectedData['size'] === 'XS') {
          newItem['size'] = 'M'
        } 
      } 
      newItem[key] = val
    }

    let maxStock = data[selectedData['color']]['maxStock'][newItem['size']]

    console.log(newItem, maxStock)

    setHoodieSelectionColor(data[selectedData['color']]['hex']);
    onChangeSelect({
      color: newItem['color'],
      size: newItem['size']? newItem['size']: 'M',
      quantity: newItem['quantity'],
      maxStock,
    }, index)
  }

  return (
    <div className={`main-cont-hoodie-select ${className}`}>
      <div id='left-side'>
        <div className='color-view-cont' style={{ backgroundColor: hoodieSelectionColor }}/>
      </div>
      <div id='right-side' use-img={useImg? "true": "false"}>
        <div>
          <h3 className='first' >Izberi si velikost puloverja</h3>
          <Select
            value={selectedData.size}
            onChange={(e) => handleChange("size", e.target.value)}
            sx={{ ...defaultDropdownSX }}
            MenuProps={menuProps}
            className="select-dropdown"
          >
            {data[selectedData.color]['sizes'].map((size, index) => (
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
            className="select-dropdown"
          >
            {Object.keys(data).map((color, index) => (
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

        {/* <div>
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
        </div> */}

        <div>
          <h3>Izberi si količino puloverjev</h3>
          <Select
            value={selectedData.quantity}
            onChange={(e) => handleChange("quantity", e.target.value)}
            sx={{ ...defaultDropdownSX }}
            MenuProps={menuProps}
            className="select-dropdown"
          >
            {data[selectedData.color]['maxStock']['selection'].map((number, index) => (
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

// // * types for hoodie selection
// interface HoodieSelection {
//   'candyfloss': HoodieSelectionPart,
//   'dusty purple': HoodieSelectionPart,
//   'fuchsia': HoodieSelectionPart,
//   'sky blue': HoodieSelectionPart,
//   'hawaii blue': HoodieSelectionPart,
//   'tropical blue': HoodieSelectionPart,
//   'light royal blue': HoodieSelectionPart,
// }

// interface HoodieSelectionPart {
//   'hex': string,
//   'sizes': string[],
//   'maxStock': {
//     'XS'?: number,
//     'S'?: number,
//     'M'?: number,
//     'L'?: number,
//     'XL'?: number,
//     'XXL'?: number,
//     '3XL'?: number,
//     '4XL'?: number,
//     'selection': number[]
//   }
// }

function HoodieSelection({ className, useImg=true, onChange=()=>{} }) {
  const [selectedData, setSelectedData] = useState([]);

  useEffect(()=>{
    onChange(selectedData)
  }, [selectedData])

  const hoodieSelections = {
    'candyfloss': {
      'hex': '#f4b8d8',
      'sizes': ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'],
      'maxStock': {
        'XS':  1  + 84,
        'S':   7  + 299,
        'M':   20 + 629,
        'L':   3  + 767,
        'XL':  12 + 500,
        'XXL': 18 + 187,
        '3XL': 4  + 58,
        '4XL': 4  + 24,
        'selection' : Array.from({length: 10}, (_, i) => i + 1)
      }
    }, 
    'dusty purple': {
      'hex': '#825F87',
      'sizes': ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'],
      'maxStock': {
        'XS':  8  + 12,
        'S':   13 + 119,
        'M':   8  + 338,
        'L':   23 + 312,
        'XL':  1  + 242,
        'XXL': 15 + 159,
        '3XL': 4  + 68,
        '4XL': 2  + 39,
        'selection' : Array.from({length: 10}, (_, i) => i + 1)
      }
    }, 
    'fuchsia': {
      'hex': '#FF00FF',
      'sizes': ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'],
      'maxStock': {
        'XS':  2  + 0,
        'S':   14 + 0,
        'M':   16 + 0,
        'L':   17 + 123,
        'XL':  5  + 145,
        'XXL': 16 + 35,
        '3XL': 3  + 67,
        '4XL': 3  + 128,
        'selection' : Array.from({length: 10}, (_, i) => i + 1)
      }
    }, 
    'sky blue': {
      'hex': '#87CEEB',
      'sizes': ['M', 'L', 'XL', 'XXL', '3XL', '4XL'],
      'maxStock': {
        'M':   7  + 0,
        'L':   13 + 0,
        'XL':  5  + 0,
        'XXL': 9  + 87,
        '3XL': 5  + 40,
        '4XL': 5  + 116,
        'selection' : Array.from({length: 10}, (_, i) => i + 1)
      }
    }, 
    'hawaii blue': {
      'hex': '#00c3e3',
      'sizes': ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'],
      'maxStock': {
        'XS':  3  + 48,
        'S':   9  + 210,
        'M':   3  + 469,
        'L':   10 + 514,
        'XL':  9  + 368,
        'XXL': 20 + 155,
        '3XL': 4  + 67,
        '4XL': 3  + 49,
        'selection' : Array.from({length: 10}, (_, i) => i + 1)
      }
    }, 
    'tropical blue': {
      'hex': '#C3DDF9',
      'sizes': ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'],
      'maxStock': {
        'XS':  0  + 24,
        'S':   17 + 269,
        'M':   0  + 471,
        'L':   4  + 447,
        'XL':  8  + 214,
        'XXL': 12 + 77,
        '3XL': 3  + 53,
        '4XL': 5  + 113,
        'selection' : Array.from({length: 10}, (_, i) => i + 1)
      }
    }, 
    'light royal blue' : {
      'hex': '#3A2EFE',
      'sizes': ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'],
      'maxStock': {
        'XS':  5  + 0,
        'S':   5  + 11,
        'M':   17 + 459,
        'L':   20 + 778,
        'XL':  18 + 549,
        'XXL': 7  + 159,
        '3XL': 4  + 74,
        '4XL': 3  + 91,
        'selection' : Array.from({length: 10}, (_, i) => i + 1)
      }
    }
  };

  const defaultHoodieSelect = {
    size: 'M',
    color: 'candyfloss',
    hex: hoodieSelections['candyfloss']['hex'],
    quantity: 1,
    maxStock: hoodieSelections['candyfloss']['maxStock']['XS'],
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
          data={hoodieSelections}
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
      <div className='plus-icon-div' onClick={() => setSelectedData([...selectedData, defaultHoodieSelect])}>
        <FontAwesomeIcon 
          icon={faPlus} 
          className='plus-icon' 
        />
        <p>nov pulover</p>
      </div>
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