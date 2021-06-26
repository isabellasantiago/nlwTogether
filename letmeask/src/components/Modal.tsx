import {ReactNode} from 'react';
import '../style/modal.scss';

type ModalProps = {
    children?: ReactNode;
}

export function Modal({children }: ModalProps){
    return(
        <div className="modal-overlay">
            <div className="modal">
                {children}
            </div>
        </div>
    );
}