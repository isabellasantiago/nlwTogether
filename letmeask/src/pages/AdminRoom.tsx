import { useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { useRoom } from '../hooks/useRoom'; 

import logoImg from "../assets/images/logo.svg";
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";
import { database } from "../services/firebase";

import "../style/room.scss";
import { useAuth } from "../hooks/useAuth";
import { Modal } from '../components/Modal';





type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const { user } = useAuth();

  const [endRoomModal, setRoomEndModal] = useState(false);
  const [deleteQuestionModal, setDeleteQuestionModal] = useState(false);

  const history = useHistory();
  const params = useParams<RoomParams>();
  
  const roomId = params.id;

  const {title, questions} = useRoom(roomId)

  async function handleCheckQuestionAsAnswered(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    })
  }

  async function handleHighlightQuestion(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    })
  }

  async function handleEndRoom(){

    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })
    history.push('/');
    
  }

  async function handleDeleteQuestion(questionId: string){
    
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    
      setDeleteQuestionModal(false)
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <a href='/'><img src={logoImg} alt="Letmeask logo" /></a>
          <div>
              <RoomCode code={roomId} />
              <Button isOutlined onClick={() => setRoomEndModal(true)}>Encerrar sala</Button>
              {endRoomModal && 
              (<Modal>
              <h1>Encerrar sala</h1>
                <span>Tem certeza que você deseja encerrar esta sala?</span>
                <div>
                    <button type="button" onClick={() => setRoomEndModal(false)}>Cancelar</button>
                    <button type="button" onClick={() => handleEndRoom()}>Sim, encerrar</button>
                </div>
              </Modal>)}
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>{title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                <>
                  <button
                  type="button"
                  onClick={() => handleCheckQuestionAsAnswered(question.id)}
                  >
                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                  </button>
                  
                  <button
                  type="button"
                  onClick={() => handleHighlightQuestion(question.id)}
                  >
                    <img src={answerImg} alt="Dar destaque a pergunta" />
                  </button>
                </>
                )}

                <button
                type="button"
                onClick={() => setDeleteQuestionModal(true)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                  </button>
                  {deleteQuestionModal &&(
                  <Modal>
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5.99988H5H21" stroke="#E73F5D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#E73F5D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h1>Excluir pergunta</h1>
                    <span>Tem certeza que você deseja excluir esta pergunta?</span>

                    <div>
                      <button type="button" onClick={() => setDeleteQuestionModal(false)}>Cancelar</button>
                      <button type="button" onClick={() => handleDeleteQuestion(question.id)}>Sim, excluir</button>
                    </div>

                  </Modal>)}
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
