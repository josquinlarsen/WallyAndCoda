import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

import PupForm from './PupForm';
import DisplayPup from './DisplayPup';
import PupModal from './PupModal';
import ContentCard from './ContentCard';
import AlertModal from './AlertModal';
import DeleteConfirmation from './DeleteConfirmation';

const MyPups = () => {
    const navigateTo = useNavigate();
    const [pups, setPups] = useState([]);
    const [selectedPup, setSelectedPup] = useState('');
    const [isActiveAlert, setIsActiveAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();

    const [isActive, setIsActive] = useState('pupDisplay')
    const [activeDelete, setIsActiveDelete] = useState(false);
    const [activeModal, setActiveModal] = useState(false);

    useEffect(() => {
        fetchPups();
    }, []);

    const fetchPups = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/wallyandcoda/pup/my_pups', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPups(response.data);
        } catch (error) {
            console.error('Error fetching pups:', error);
            if (error.response.status === 401) {
                // Unauthorized, redirect to login page
                navigateTo('/login');
            }
        }
    };

    const handleDeletePup = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://127.0.0.1:8000/wallyandcoda/pup/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Reset selectedPup to null
            setSelectedPup(null);
            // Fetch pups again to update UI
            fetchPups();
        } catch (error) {
            console.error('Error deleting pup:', error);
        }
    };

    const handleEditClick = (pup, value) => {
        setIsActive(value);
        setSelectedPup(pup);
    }

    function handleClick(value) {
        setIsActive(value);
    }

    const openPupModal = (pup) => {
        setSelectedPup(pup);
        setActiveModal(true);
    }

    const closePupModal = () => {
        setActiveModal(false);
        setSelectedPup(null);
    }

    const closeAlertModal = () => {
        setIsActiveAlert(false);
    }

    const openDeleteModal = () => {
        setIsActiveDelete(true);
    }

    const closeDeleteModal = () => {
        setIsActiveDelete(false);
    }

    let displayPup = (
        <DisplayPup currentPup={selectedPup} />
    );

    // This can be extracted into its own component
    let myPups = (
        <>
            <table className='my-pups'>
                <tbody>
                    {pups.map(pup => (
                        <tr key={pup.id}>
                            <th onClick={() => openPupModal(pup)}>{pup.pup_name}</th>
                            <td>
                                <FontAwesomeIcon
                                    icon={faEdit}
                                    onClick={() => handleEditClick(pup, 'editPup')}
                                />
                                <FontAwesomeIcon
                                    className='trash'
                                    icon={faTrash}
                                    onClick={openDeleteModal}
                                />
                                {activeDelete && (
                                    <AlertModal
                                        close={closePupModal}
                                        content={(
                                            <DeleteConfirmation
                                                onConfirm={() => {
                                                    handleDeletePup(pup.id);
                                                    closeDeleteModal();
                                                }}
                                                onCancel={closeDeleteModal}
                                            />)}
                                        modalStyle={'pup-modal'}
                                        isDelete={true}
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {activeModal && selectedPup && (
                <PupModal
                    close={closePupModal}
                    content={displayPup}
                    modalStyle={'pup-modal'}
                    isDelete={false} />
            )}
        </>
    );

    return (
        <div className='container'>
            {(isActive === 'pupDisplay') ? (
                <div>
                    <div>
                        <button className='add-button' onClick={() => handleClick('addPup')}>+ new pup</button>
                    </div>
                    <ContentCard className={"my-pups"} content={myPups} />
                </div>
            ) : (
                <div>
                    <PupForm
                        httpType={isActive === 'addPup' ? 'post' : 'put'}
                        updatePups={fetchPups}
                        pup_id={selectedPup?.id}
                        setIsActive={setIsActive}
                        setIsActiveAlert={setIsActiveAlert}
                        setAlertMessage={setAlertMessage}
                    />
                </div>
            )}
            {isActiveAlert && (
                <AlertModal
                    close={closeAlertModal}
                    content={alertMessage}
                    modalStyle={'pup-modal'}
                    isDelete={false}
                />
            )}
        </div>


    );
};

export default MyPups;
