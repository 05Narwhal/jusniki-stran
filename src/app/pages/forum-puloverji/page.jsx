"use client";
import React, {useState} from 'react';
import { Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { ClassSelect, HoodieSelectBox, InputField, TextContainer, HoodieSelection } from '../../components/forum-containers/components';
import { getTheme } from '../../utils/projectColors';
import { addToFirebase } from '../../utils/databaseManager';
import { getFormattedDateTime } from '../../utils/basicFuncs';

import './styles.scss';
import 'react-toastify/dist/ReactToastify.css';
import { primaryColor, secondaryColor, fontColorOpp } from "../../styles/variables.module.scss"

function ForumHoodie() {
  const router = useRouter()

  const [selectedName, setSelectedName]       = useState(null)
  const [selectedOddelek, setSelectedOddelek] = useState(null)
  const [selectedClass, setSelectedClass]     = useState(null)
  const [selectedData, setSelectedData]       = useState(null)

  const handleAddToFirebase = () => {
    // check if all fields are valid
    if (selectedName === null || selectedName === "") {
      toast.error("Prosim vnesi ime!")
      return
    } else if (selectedClass === null) {
      toast.error("Prosim vnesi letnik!")
      return 
    } else if (selectedOddelek === null) {
      toast.error("Prosim vnesi oddelek!")
      return 
    } else if (selectedData.length === 0) {
      toast.warn("Zakaj prideš sem in oddaš naročilo brez puloverjev?")
      return
    }

    let name = selectedName
    let letnik = selectedClass !== "noSKG"? selectedClass === 'prof'? "prof" : `${selectedClass}.${selectedOddelek}` : "/"
    let dateOfSubmit = getFormattedDateTime()
    let data = selectedData

    let toastLoading = toast.loading("Shranjujem na strežnik...")

    addToFirebase({
      date  : dateOfSubmit,
      name  : name,
      letnik: letnik,
      order : data
    }).then((res) => {
      toast.dismiss(toastLoading)

      if (res.success) {
        toast.success("Shranjeno na strežnik!")
        setTimeout(() => {
          router.replace('/pages/hvala-za-nakup')
        }, 700)
      } else {
        toast.error("Poskusi še enkrat prosim :(")
      }
    })
  }

  return (
    <main>
      <TextContainer
        title="Naročilo puloverjev"
        description="Izpolnite spodnji obrazec in naročite svoj pulover."
      />
      <ClassSelect 
        title="Izberi svoj letnik in oddelek: "
        onChange={(e, f) => {setSelectedClass(e); setSelectedOddelek(f);}}
      />
      <InputField
        placeholder="Vnesi ime"
        title="Vnesi ime: "
        onChange={(e) => setSelectedName(e)}
      />
      <HoodieSelection 
        onChange={(e) => setSelectedData(e)}
      />
      <Button
        variant="contained"
        className='submit-btn'
        sx={{ 
          backgroundColor: primaryColor,
          color: fontColorOpp,
          transition: 'all 0.3s',
          fontWeight: 'bold',
          fontSize: '1.6em',
          borderRadius: '10px',
          margin: "20px",
          marginBottom: '60px',
          width: '90%',
          '&:hover': {
            backgroundColor: secondaryColor,
            transform: 'scale(1.05)',
          }
        }}
        onClick={() => handleAddToFirebase()}
      >
        Oddaj Anketo
      </Button>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        pauseOnHover={false}
        closeOnClick
        rtl={false}
        theme={getTheme()}
      />
    </main>
  );
}

export default ForumHoodie;