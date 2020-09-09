import React, {useState} from 'react';
import { Formik, Form, Field } from 'formik';
import {Button, makeStyles} from "@material-ui/core";
import MaterialTable from "material-table";
import * as Yup from 'yup';
import axios from 'axios'
import tableIcons from './util/tableIcons'
import CustomCsvFileInput from './components/CustomCsvFileInput'


const useStyles = makeStyles({
  container:  {
    width: '60%',
    margin: 'auto'
  },
  header: {
    margin: '24px 40px',
    color: '#333'
  },
  submitbutton: {
    width: '100%',
    "margin-bottom": '30px'
  }
})




function App() {

  const classes = useStyles();


  const FILE_SIZE = 2 * 1024 * 1024; // Mb
  const SUPPORTED_FORMAT = "application/vnd.ms-excel"
  const validationSchema = Yup.object().shape({
    agentsfile: Yup
      .mixed()
      .required("Agents file is required")
      .test(
        "fileSize",
        "File too large",
        value => value && value.size <= FILE_SIZE
      )
      .test(
        "fileFormat",
        "We only support csv format",
        value => value && SUPPORTED_FORMAT === value.type
      ),
    leadsfile: Yup
      .mixed()
      .required("Leads file is required")
      .test(
        "fileSize",
        "File too large",
        value => value && value.size <= FILE_SIZE
      )
      .test(
        "fileFormat",
        "We only support csv format",
        value => value && SUPPORTED_FORMAT === value.type
      )
  });

  const [partArr, setPartArr] = useState([])

  return (
    <div className={classes.container}>
      <header>
        <h1 className={classes.header}>Technical Assessment by karima zineddine</h1>
      </header>
      <Formik
        initialValues={{
          agentsfile: undefined,
          leadsfile: undefined
        }}
        validationSchema={validationSchema}
        onSubmit={values => {
          let body = new FormData();
          body.append('agentsfile', values['agentsfile']);
          body.append('leadsfile', values['leadsfile']);
          axios.post('http://localhost:8000/api/partition', body)
          .then(({data}) => setPartArr(data))
        }}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form>
              <Field
                name="agentsfile"
                component={CustomCsvFileInput}
                title="Select agents csv file"
                setFieldValue={setFieldValue}
                errorMessage={errors["agentsfile"]}
                touched={touched["agentsfile"]}
              />
              <Field
                name="leadsfile"
                component={CustomCsvFileInput}
                title="Select leads csv file"
                setFieldValue={setFieldValue}
                errorMessage={errors["leadsfile"]}
                touched={touched["leadsfile"]}
              />
              <Button 
                className={classes.submitbutton}
                variant="contained" 
                type="submit"
                color="primary">
                Submit
              </Button>
          </Form>
        )}
      </Formik>

      <MaterialTable
        icons={tableIcons}
        title="Partition"
        columns={[
          { title: "Lead Name", field: "lead_name" },
          { title: "Lead Email", field: "lead_email" },
          { title: "Assigned Agent", field: "assigned_agent" },
        ]}
        data={partArr}
      />      


    </div>
  );
}

export default App;
