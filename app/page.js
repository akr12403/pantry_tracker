'use client'
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import {Box, Modal, Typography, Stack, TextField, Button} from '@mui/material'
import {collection, deleteDoc, doc, getDocs, query, getDoc, setDoc} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [search_term, setSearchTerm] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const search_item = inventory.filter(inventory => inventory.name.toLowerCase().includes(search_term.toLowerCase()))
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)


  return (
    <Box
      backgroundColor='cyan'
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}      
    >
      <Typography variant="h2" color='black' marginBottom={40} position='sticky' >Welcome to Pantry Tracker!</Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen} sx={{marginTop: -38, marginBottom: 5}} >
        Add New Item to Inventory
      </Button>
      <Box border={'1px solid #333'}>
        <Box
          width="1200px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          position="sticky"
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="1200px" height="300px" spacing={0} overflow={'auto'} sx={{bgcolor: 'white'}}>
          {search_item.map(({name, quantity}) => (
            <Box
              key={name}
              position='flex'
              width="100%"
              minHeight="100px"
              border='0.5px solid #001'
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Typography variant={'h4'} color={'#333'} textAlign={'center'} sx={{flex: '1 1 auto', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px',  fontSize: '1rem'}}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h4'} color={'#333'} textAlign={'center'} sx={{flex: '0 0 auto', marginLeft: '16px', fontSize: '1rem'}}>
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" onClick={() => addItem(name)} sx={{flex: '0 0 auto'}}>
                +
              </Button>
              <Button variant="contained" onClick={() => removeItem(name)} sx={{flex: '0 0 auto'}}>
                -
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
      <TextField label="Search Inventory" variant='outlined' sx={{width: '40%', bgcolor: 'white'}} onChange={e => setSearchTerm(e.target.value)}/> {/*test section*/}
    </Box>
  )
}
