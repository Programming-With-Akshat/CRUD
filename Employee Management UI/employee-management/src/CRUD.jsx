import Table from 'react-bootstrap/Table';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function CRUD() {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState();
	const [department, setDepartment] = useState('');

	const [editID, setEditID] = useState();
	const [editName, setEditName] = useState('');
	const [editEmail, setEditEmail] = useState('');
	const [editPhone, setEditPhone] = useState();
	const [editDepartment, setEditDepartment] = useState('');

	const [data, setData] = useState([]);

	useEffect(() => {
		getData();
	}, []);

	const getData = () => {
		axios
			.get('http://localhost:5076/api/Employee')
			.then((result) => {
				setData(result.data);
			})
			.catch((error) => {
				alert(error);
			});
	};

	const handleEdit = (id) => {
		handleShow();
		axios
			.get(`http://localhost:5076/api/Employee/${id}`)
			.then((result) => {
				setEditName(result.data.name);
				setEditEmail(result.data.email);
				setEditPhone(result.data.phone);
				setEditDepartment(result.data.department);
				setEditID(id);
			})
			.catch((error) => {
				alert(error);
			});
	};

	const handleDelete = (id) => {
		if (window.confirm('Are you sure you want to delete this?') === true)
			axios
				.delete(`http://localhost:5076/api/Employee/${id}`)
				.then((result) => {
					if (result.status === 200) {
						toast.success('Successfully deleted employee!');
						getData();
					}
				})
				.catch((error) => {
					alert(error);
				});
	};

	const handleUpdate = () => {
		const url = `http://localhost:5076/api/Employee/${editID}`;
		const data = {
			id: editID,
			name: editName,
			email: editEmail,
			phone: editPhone,
			department: editDepartment
		};

		axios
			.put(url, data)
			.then((result) => {
				handleClose();
				getData();
				clear();
				toast.success('Successfully updated employee!');
			})
			.catch((error) => {
				alert(error);
			});
	};

	const handleCreate = () => {
		const url = 'http://localhost:5076/api/Employee';
		const data = {
			name: name,
			email: email,
			phone: phone,
			department: department
		};

		axios
			.post(url, data)
			.then((result) => {
				getData();
				clear();
				toast.success('Successfully created employee!');
			})
			.catch((error) => {
				alert(error);
			});
	};

	const clear = () => {
		setName('');
		setEmail('');
		setPhone(0);
		setDepartment('');
		setEditName('');
		setEditEmail('');
		setEditPhone(0);
		setEditDepartment('');
		setEditID(0);
	};

	return (
		<>
			<Container className=''>
				<Row>
					<Col>
						<input
							type='text'
							className='form-control'
							placeholder='Name'
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>{' '}
						&nbsp;
					</Col>
					<Col>
						<input
							type='text'
							className='form-control'
							placeholder='Email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</Col>
					<Col>
						<input
							type='number'
							className='form-control'
							placeholder='Phone number'
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
						/>
					</Col>
					<Col>
						<input
							type='string'
							className='form-control'
							placeholder='Department'
							value={department}
							onChange={(e) => setDepartment(e.target.value)}
						/>
					</Col>
					<Col>
						<button className='btn btn-primary' onClick={() => handleCreate()}>
							Create
						</button>
					</Col>
				</Row>
			</Container>

			<br />

			<Table striped bordered hover>
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						<th>Email</th>
						<th>Phone number</th>
						<th>Department</th>
					</tr>
				</thead>
				<tbody>
					{data && data.length > 0
						? data.map((item, index) => (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>{item.name}</td>
									<td>{item.email}</td>
									<td>{item.phone}</td>
									<td>{item.department}</td>
									<td>
										<button
											onClick={() => handleEdit(item.id)}
											className='btn btn-primary crud__button'
										>
											Edit
										</button>
										&nbsp;
										<button
											onClick={() => handleDelete(item.id)}
											className='btn btn-danger crud__button'
										>
											Delete
										</button>
									</td>
								</tr>
						  ))
						: 'Loading...'}
				</tbody>
			</Table>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Edit Employee</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Container>
						<Row xs={2}>
							<Col>
								<input
									type='text'
									className='form-control'
									placeholder='Name'
									value={editName}
									onChange={(e) => setEditName(e.target.value)}
								/>{' '}
								&nbsp;
							</Col>
							<Col>
								<input
									type='text'
									className='form-control'
									placeholder='Email'
									value={editEmail}
									onChange={(e) => setEditEmail(e.target.value)}
								/>
							</Col>
							<Col>
								<input
									type='number'
									className='form-control'
									placeholder='Phone number'
									value={editPhone}
									onChange={(e) => setEditPhone(e.target.value)}
								/>
							</Col>
							<Col>
								<input
									type='string'
									className='form-control'
									placeholder='Department'
									value={editDepartment}
									onChange={(e) => setEditDepartment(e.target.value)}
								/>
							</Col>
						</Row>
					</Container>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleClose}>
						Close
					</Button>
					<Button variant='primary' onClick={handleUpdate}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>

			<Toaster position='top-right' />
		</>
	);
}

export default CRUD;
