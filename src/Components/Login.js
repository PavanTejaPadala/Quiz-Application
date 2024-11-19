import { Box, Button, Card, CardContent, TextField, Typography} from '@mui/material'
import React, { useEffect, useState } from 'react'
import Center from './Center'
import useForm from '../Hooks/useForm'
import { ENDPOINTS, createAPIEndpoint } from '../Api'
import useStateContext from '../Hooks/useStateContext'
import { useNavigate } from 'react-router-dom'

const getFreshModel= ()=>({
    name:'',
    email:''
})

export default function Login() {
    const {context, setContext, resetContext} = useStateContext();
    const navigate = useNavigate();
    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange
    }  = useForm(getFreshModel);

    useEffect(() => {
        resetContext();
    }, []);

    const login = async (e) => {
        e.preventDefault();
        
        if (validate()) { 
            try {
                const res = await createAPIEndpoint(ENDPOINTS.participant).create(values);
                setContext({ participantID: res.data.participantID }); 
                navigate('/topics'); // Redirect to topics instead of quiz
            } catch (err) {
                console.error("Error occurred:", err);
                alert("Login failed. Please try again.");
            }
        } else {
            console.log("Validation failed.");
        }
    };

    const validate = () => {
        let temp = {};
        temp.email = (/\S+@\S+\.\S+/).test(values.email) ? "" : "Email is not valid.";
        temp.name = values.name !== "" ? "" : "This field is required.";
        setErrors(temp);
        return Object.values(temp).every(x => x === "");
    };

    return (
        <Center>
            <Card sx={{width:"400px"}}>
                <CardContent sx={{textAlign:"center"}}>
                    <Typography variant='h3' sx={{my:3}}>Quiz App</Typography>
                    <Box sx={{
                        '& .MuiTextField-root': {
                            m: 1,
                            width:'90%'
                        }
                    }}>
                        <form noValidate autoComplete='Off' onSubmit={login}>
                            <TextField label="Email" name='email' value={values.email} onChange={handleInputChange} variant='outlined' {...(errors.email && {error:true, helperText:errors.email})} />
                            <TextField label="Name" name='name' value={values.name} onChange={handleInputChange} variant='outlined' {...(errors.name && {error:true, helperText:errors.name})} />
                            <Button type='submit' variant='contained' size='large' sx={{ width:'90%' }}>Start</Button>
                        </form>
                    </Box>
                </CardContent>
            </Card>
        </Center>
    );
}
