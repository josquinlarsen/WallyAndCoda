import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

import FormatDate from '../util/FormatDate';
import AlertModal from './AlertModal';
import DeleteConfirmation from './DeleteConfirmation';

export default function DisplayPupRecords({ records, handleDelete, setIsActive, setRecordId, activeDelete, openDelete, closeDelete }) {
    if (records.length === 0) {
        return <p>No records yet!</p>;
    }

    const handleEditClick = (record_id) => {
        setIsActive('editRecord');
        setRecordId(record_id)
    }

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Doctor</th>
                        <th>Vet Address</th>
                        <th>Vet Number</th>
                        <th>Cost</th>
                        <th>Notes</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(record => (
                        <tr key={record.id}>
                            <td>{record.record_type}</td>
                            <td><FormatDate date={record.record_date} /></td>
                            <td>Dr. {record.doctor_name}</td>
                            <td>{record.vet_address}</td>
                            <td>{record.vet_phone_number}</td>
                            <td>${record.cost}</td>
                            <td>{record.record_note}</td>
                            <td>
                                <FontAwesomeIcon
                                    style={{ cursor: 'pointer' }}
                                    icon={faEdit}
                                    onClick={() => handleEditClick(record.id)}
                                />

                                <FontAwesomeIcon
                                    style={{ cursor: 'pointer' }}
                                    className='trash'
                                    icon={faTrash}
                                    onClick={() => openDelete()}
                                />
                                {activeDelete && (
                                    <AlertModal
                                        close={closeDelete}
                                        content={(
                                            <DeleteConfirmation
                                                onConfirm={() => {
                                                    handleDelete(record.id);
                                                    closeDelete();
                                                }}
                                                onCancel={closeDelete}
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
        </>
    );
}