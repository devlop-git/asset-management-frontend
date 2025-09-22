import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { toastError, toastSuccess } from "../utils/toast";
import { Add, CheckIcon, Close, Delete, Edit } from "../assets/Icons";
import Modal from "./../components/Modal";
import { useAuth } from "../context/AuthContext";

const headingList = ["Username", "Status", "Action"];

const Heading = ({
  label,
  btnLabel,
  isFilterOpen,
  setIsFilterOpen,
  roleData,
  setRoleData,
  handleSave,
}) => (
  <div className="flex justify-between">
    <div className="relative mb-3 w-[50%] flex gap-5">
      <label className="block mb-2 text-md font-medium uppercase">
        {label}
      </label>
    </div>

    <Modal
      isOpen={isFilterOpen}
      title={btnLabel}
      onClose={() => setIsFilterOpen(false)}
      footer={
        <button
          type="button"
          onClick={handleSave}
          className="text-white end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {btnLabel}
        </button>
      }
      className="w-[30%]"
    >
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Role Name
        </label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none p-2"
          id="role_input"
          type="text"
          value={roleData.name}
          placeholder="Enter Role Name"
          onChange={(e) =>
            setRoleData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <div className="flex items-center my-4 gap-3">
          <label className="text-sm font-medium text-gray-900">Status</label>
          <input
            type="checkbox"
            className="ml-2"
            name="status"
            checked={roleData.status}
            onChange={(e) =>
              setRoleData((prev) => ({ ...prev, status: e.target.checked }))
            }
          />
        </div>
      </div>
    </Modal>
    <div className="mb-2">
      <button
        type="button"
        className="inline-flex items-center gap-2 cursor-pointer text-white bg-blue-600 focus:ring-gray-300 font-medium rounded-lg text-sm px-2 py-1"
        onClick={() => setIsFilterOpen(true)}
      >
        <Add />
        {btnLabel}
      </button>
    </div>
  </div>
);

const Roles = () => {
  const [datasource, setDatasource] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [roleData, setRoleData] = useState({ name: "", status: true });
  const [editingRoleId, setEditingRoleId] = useState(null);
  const { user } = useAuth();
  const IsSuperAdmin = user.role.toLowerCase() === 'superadmin'

  const getRoles = async () => {
    try {
      const response = await api.get("/role");
      const { success, data, message } = response.data;
      setDatasource(data);
      if (!success) throw new Error(message || "Something went wrong");
    } catch (ex) {
      toastError(ex.message);
    }
  };

  const handleEditClick = (role) => {
    setEditingRoleId(role.id);
    setRoleData({ name: role.name ?? "", status: !!role.status });
    setIsFilterOpen(true);
  };

  const handleAdd = async () => {
    try {
      const response = await api.post(`role`, {
        name: roleData.name,
        status: roleData.status ? 1 : 0,
      });
      const { success, message, data } = response.data;
      if (!success) throw new Error(message);
      setIsFilterOpen(false);
      setDatasource((prev) => [...prev, data]);
      setRoleData({ name: "", status: false });
      toastSuccess(message);
    } catch (ex) {
      toastError(ex.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await api.post(`role/${editingRoleId}`, {
        name: roleData.name,
        status: roleData.status ? 1 : 0,
      });
      const { success, message, data } = response.data;
      if (!success) throw new Error(message);
      setIsFilterOpen(false);
      setDatasource((prev) => prev.map((r) => (r.id === editingRoleId ? data : r)));
      setEditingRoleId(null);
      setRoleData({ name: "", status: false });
      toastSuccess(message);
    } catch (ex) {
      toastError(ex.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`role/${id}`);
      const { success, message } = response.data;
      if (!success) throw new Error(message);
      const newData = datasource.filter((i) => i.id !== id);
      setDatasource(newData);
      toastSuccess(message);
    } catch (ex) {
      toastError(ex.message);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const TableHeader = ({ headingList }) => (
    <thead className="bg-gray-50">
      <tr>
        {headingList.map((item, index) => (
          <th
            key={index}
            className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {item}
          </th>
        ))}
      </tr>
    </thead>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm ml-5">
        <Heading
          label="Role List"
          btnLabel={editingRoleId ? "Edit Role" : "Add Role"}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={(open) => {
            if (!open) {
              setEditingRoleId(null);
              setRoleData({ name: "", status: true });
            }
            setIsFilterOpen(open);
          }}
          roleData={roleData}
          setRoleData={setRoleData}
          handleSave={editingRoleId ? handleUpdate : handleAdd}
        />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <TableHeader headingList={headingList} />
            <tbody className="bg-white divide-y divide-gray-200">
              {datasource?.map((i, index) => (
                <tr
                  key={`${index}-${i.id}`}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-2 whitespace-wrap text-sm text-gray-900">
                    {i.name}
                  </td>
                  <td className="px-4 py-2 whitespace-wrap text-sm text-gray-900">
                    {i.status ? (
                      <CheckIcon color="green" stroke="green" />
                    ) : (
                      <Close />
                    )}
                  </td>
                   <td className="px-4 py-2 whitespace-wrap text-sm text-gray-900 flex gap-3 cursor-pointer">
                     <Edit fill="green" onClick={() => handleEditClick(i)} />
                      {IsSuperAdmin && <Delete fill="red" onClick={() => handleDelete(i.id)} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Roles;
