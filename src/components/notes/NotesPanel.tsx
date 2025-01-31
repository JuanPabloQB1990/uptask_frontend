import { Task } from '@/types/index'
import AddNoteForm from './AddNoteForm'
import NoteDetails from './NoteDetails'

type NotesPanelProps = {
    notes: Task["notes"]
}
const NotesPanel = ({notes} : NotesPanelProps) => {
  return (
    <div>
        <AddNoteForm />
        <div className="divide-y divide-gray-100 mt-10">
            {notes.length ? (
                    <>
                        <p className='font-bold text-2xl text-slate-600 my-10'>Notas:</p>
                        {notes.map(note => <NoteDetails key={note._id} note={note}/>)}
                    </>
                ) : <p className='text-gray-500 text-center pt-3'>No hay notas</p>
            }
        </div>
    </div>
  )
}

export default NotesPanel