import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import UserList from './components/UserList';
import UserListSaga from './components/UserListSaga';
import AddUserForm from './components/AddUserForm';
import AddUserFormSaga from './components/AddUserFormSaga';
import UpdateUserForm from './components/UpdateUserForm';
import UpdateUserFormSaga from './components/UpdateUserFormSaga';
import PatchUserForm from './components/PatchUserForm';
import PatchUserFormSaga from './components/PatchUserFormSaga';
import DeleteUserForm from './components/DeleteUserForm';
import DeleteUserFormSaga from './components/DeleteUserFormSaga';
import FetchUserDetails from './components/FetchUserDetails';
import UserDetails from './components/UserDetails';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Redux Auto-Update Demo</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <UserList />
            <div className="mt-8">
              <AddUserForm />
            </div>
            <div className="mt-8">
              <UpdateUserForm />
            </div>
            <div className="mt-8">
              <PatchUserForm />
            </div>
            <div className="mt-8">
              <DeleteUserForm />
            </div>
            <div className="mt-8">
              <FetchUserDetails />
            </div>
          </div>
          <div>
            <UserListSaga />
            <div className="mt-8">
              <AddUserFormSaga />
            </div>
            <div className="mt-8">
              <UpdateUserFormSaga />
            </div>
            <div className="mt-8">
              <PatchUserFormSaga />
            </div>
            <div className="mt-8">
              <DeleteUserFormSaga />
            </div>
            <div className="mt-8">
              <UserDetails />
            </div>
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default App;

