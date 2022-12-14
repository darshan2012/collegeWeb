import React, { useState } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import { AiFillDelete } from 'react-icons/ai';
import { MdCancelPresentation } from 'react-icons/md';
import { Form } from 'react-bootstrap';



function Notice(props) {
    const {
        deleteNotice,
        editNotice,
        _id,
        description,
        noticeLink,
        isAdmin
    } = props
    
    const [isEditNotice, setEditNotice] = useState(false);
    const [formDescription, setDescription] = useState(description);
    return (
        <div>
            {isEditNotice ?
                // <Form className='row' onSubmit={(e) => {
                //     e.preventDefault()


                // }} >
                <div className='row mt-2'>
                    <span className='col-10 mt-2'>
                    <div><input  value={formDescription} name="description" onChange={(e) => setDescription(e.target.value)} /></div>
                    {
                        <a href={noticeLink} target='_blank'>
                            {noticeLink && noticeLink !== undefined && noticeLink !== "" ? " click here" : ""}</a>
                    }
                    </span>
                    
                    {isAdmin && <span className='col-2 ms-auto'>
                        <FaSave type='submit' cursor="pointer" onClick={() => {
                            setEditNotice(false);
                            editNotice(_id, formDescription)
                        }} >
                        </FaSave>
                        <MdCancelPresentation cursor="pointer" onClick={() => { setDescription(description); setEditNotice(false) }} className='ms-1'>
                        </MdCancelPresentation>
                    </span>}
                </div>
                // </Form>
                :
                <span className='row'>
                    <span className='col-10'>{description}
                        {
                            <a href={noticeLink} target='_blank'>
                                {noticeLink && noticeLink !== undefined && noticeLink !== "" ? " click here" : ""}</a>
                        }
                    </span>

                    {isAdmin && isAdmin && <span className='col-2 ms-auto'>
                        <FaEdit cursor="pointer" onClick={() => { setEditNotice(true) }} className=''>
                        </FaEdit>
                        <AiFillDelete cursor="pointer" onClick={() => deleteNotice(_id)} className='ms-1'>
                        </AiFillDelete>
                    </span>
}
                </span>

            }
        </div>
    );
}

export default Notice;