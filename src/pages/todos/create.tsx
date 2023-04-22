import { type NextPage } from "next";
import { useState } from "react";
import { api } from "../../utils/api";

const TodoForm:NextPage = () => {
    const [name, setName] = useState("");
    const [description,setdescription] = useState("");

    const createTodoMutation = api.todosRouter.createTodo.useMutation()

    function createTodo() {
        createTodoMutation.mutate({
            description,
            name
        },{
            onError(error, variables, context){
                console.log(error)
            },
            onSuccess(data, variables, context) {
                alert(`Todo ${data.name} created`)
            }
        })
    }

    return (
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
        <div className="relative w-full bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
          <form
          onSubmit={(e) => {
            e.preventDefault();
            createTodo();
          }}
          >
            <label className="mb-2 block" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              required
              className="h-11 w-full rounded border-2"
              type="text"
              onChange={e => setName(e.target.value)}
            />
            <label className="mb-2 mt-4 block" htmlFor="description">
              Description
            </label>
            <input
              required
              className="h-11 w-full rounded border-2"
              type="text"
              id="description"
              onChange={e => setdescription(e.target.value)}
            />
            <input
              className="mt-6 h-10 w-full cursor-pointer rounded bg-indigo-600 text-white"
              type="submit"
              value={"Create"}
            />
          </form>
        </div>
      </div>
    )
}

export default TodoForm;