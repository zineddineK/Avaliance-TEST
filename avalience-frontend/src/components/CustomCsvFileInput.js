import React from 'react'
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';
import {Paper} from '@material-ui/core';

const useStyles = makeStyles({
    input_container: {
      background: 'linear-gradient(45deg, #B993D6 30%, #8CA6DB 90%)',
      color: 'white',
      padding: '30px',
      margin: '20px'
    },
    input_button :{ 
        "margin-top": '20px'
    }
  });

function CustomCsvFileInput({field, title, errorMessage, setFieldValue}) {

    const classes = useStyles();

    return (
        <Paper elevation={3} className={classes.input_container}>
            <Typography variant="h5">{title}</Typography>

            <input
                className={classes.input_button}
                id={field.name}
                name={field.name}
                type="file"
                onChange={(event) => {
                    console.log(field.name);
                    setFieldValue(field.name, event.currentTarget.files[0]);
                }}
            />

            {errorMessage ? (
                <Typography variant="caption" color="error">
                    {errorMessage}
                </Typography>
            ) : null}
      </Paper>
    )
}

export default CustomCsvFileInput;