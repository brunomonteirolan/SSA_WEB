import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Button, Flex, Text, Badge, IconButton, useToast,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  FormControl, FormLabel, Input, Select, CheckboxGroup, Checkbox, Stack,
  Table, Thead, Tbody, Tr, Th, Td, Tooltip, useDisclosure,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay, Spinner, Center, Switch,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, CopyIcon } from "@chakra-ui/icons";
import Container from "../../components/Container";

interface UserRow {
  _id: string;
  name: string;
  email: string;
  status: "Active" | "Inactive" | "Pending";
  role: "admin" | "manager" | "viewer";
  permissions: string[];
  confirmationCode?: string | null;
  createdAt: string;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  manager: "Gerente",
  viewer: "Visualizador",
};

const PERMISSION_OPTIONS = [
  { value: "stores", label: "Lojas (Stores)" },
  { value: "apps", label: "Aplicativos (Apps)" },
  { value: "users", label: "Usuários" },
];

const STATUS_COLOR: Record<string, string> = {
  Active: "green",
  Inactive: "red",
  Pending: "yellow",
};

export default function UsersPage() {
  const toast = useToast();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const createModal = useDisclosure();
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "viewer", permissions: ["stores"] as string[] });

  const editModal = useDisclosure();
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [editForm, setEditForm] = useState({ name: "", role: "viewer", permissions: [] as string[] });

  const deleteDialog = useDisclosure();
  const [deletingUser, setDeletingUser] = useState<UserRow | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/users");
      setUsers(data.users);
    } catch (err: any) {
      toast({ status: "error", description: err.response?.data?.message || "Erro ao carregar usuários" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      return toast({ status: "warning", description: "Nome e e-mail são obrigatórios" });
    }
    setSubmitting(true);
    try {
      const { data } = await axios.post("/api/auth/signup", {
        name: newUser.name.trim(),
        email: newUser.email.trim(),
        role: newUser.role,
        permissions: newUser.permissions,
      });
      toast({ status: "success", description: "Usuário criado com sucesso!" });
      setUsers((prev) => [data.user, ...prev]);
      setNewUser({ name: "", email: "", role: "viewer", permissions: ["stores"] });
      createModal.onClose();
    } catch (err: any) {
      toast({ status: "error", description: err.response?.data?.message || "Erro ao criar usuário" });
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (user: UserRow) => {
    setEditingUser(user);
    setEditForm({ name: user.name, role: user.role || "viewer", permissions: user.permissions || [] });
    editModal.onOpen();
  };

  const handleEdit = async () => {
    if (!editingUser) return;
    setSubmitting(true);
    try {
      const { data } = await axios.patch("/api/users", {
        id: editingUser._id,
        name: editForm.name.trim(),
        role: editForm.role,
        permissions: editForm.permissions,
      });
      toast({ status: "success", description: "Usuário atualizado!" });
      setUsers((prev) => prev.map((u) => (u._id === editingUser._id ? { ...u, ...data.user } : u)));
      editModal.onClose();
    } catch (err: any) {
      toast({ status: "error", description: err.response?.data?.message || "Erro ao editar usuário" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: UserRow) => {
    if (user.status === "Pending") {
      return toast({ status: "warning", description: "Usuário ainda não fez o primeiro acesso" });
    }
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    try {
      await axios.patch("/api/users", { id: user._id, status: newStatus });
      toast({ status: "success", description: `Usuário ${newStatus === "Active" ? "ativado" : "desativado"}!` });
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, status: newStatus } : u)));
    } catch (err: any) {
      toast({ status: "error", description: err.response?.data?.message || "Erro ao alterar status" });
    }
  };

  const openDelete = (user: UserRow) => {
    setDeletingUser(user);
    deleteDialog.onOpen();
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setSubmitting(true);
    try {
      await axios.delete(`/api/users?id=${deletingUser._id}`);
      toast({ status: "success", description: "Usuário excluído!" });
      setUsers((prev) => prev.filter((u) => u._id !== deletingUser._id));
      deleteDialog.onClose();
    } catch (err: any) {
      toast({ status: "error", description: err.response?.data?.message || "Erro ao excluir usuário" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = (user: UserRow) => {
    if (!user.confirmationCode) return;
    const url = `${window.location.origin}/first-access/${user.confirmationCode}`;
    navigator.clipboard.writeText(url).catch(() => {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
    toast({ status: "success", description: "Link de primeiro acesso copiado!" });
  };

  return (
    <Container pageTitle="Usuários">
      <Flex align="center" justify="space-between" mb={6}>
        <Box>
          <Text fontSize="xl" fontWeight={700} color="white">Usuários</Text>
          <Text fontSize="sm" color="#666">{users.length} usuário{users.length !== 1 ? "s" : ""} cadastrado{users.length !== 1 ? "s" : ""}</Text>
        </Box>
        <Button leftIcon={<AddIcon />} colorScheme="brand" size="sm" onClick={createModal.onOpen}>
          Novo Usuário
        </Button>
      </Flex>

      {loading ? (
        <Center py={20}><Spinner color="#E3001B" size="lg" /></Center>
      ) : users.length === 0 ? (
        <Center py={20} flexDir="column" gap={3}>
          <Text color="#555" fontSize="lg">Nenhum usuário cadastrado</Text>
          <Button size="sm" colorScheme="brand" onClick={createModal.onOpen}>Criar primeiro usuário</Button>
        </Center>
      ) : (
        <Box bg="#111111" border="1px solid #1F1F1F" borderRadius="12px" overflow="hidden">
          <Table variant="simple">
            <Thead>
              <Tr bg="#0D0D0D">
                <Th>Nome</Th>
                <Th>E-mail</Th>
                <Th>Perfil</Th>
                <Th>Permissões</Th>
                <Th>Status</Th>
                <Th>Ativo</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user._id} _hover={{ bg: "#161616" }} transition="bg 0.15s">
                  <Td><Text fontWeight={600} color="white" fontSize="sm">{user.name}</Text></Td>
                  <Td><Text color="#AAA" fontSize="sm">{user.email}</Text></Td>
                  <Td>
                    <Badge
                      colorScheme={user.role === "admin" ? "red" : user.role === "manager" ? "orange" : "gray"}
                      fontSize="xs" px={2} py={0.5} borderRadius="4px"
                    >
                      {ROLE_LABELS[user.role] || user.role || "viewer"}
                    </Badge>
                  </Td>
                  <Td>
                    <Flex gap={1} flexWrap="wrap">
                      {(user.permissions || []).map((p) => (
                        <Badge key={p} colorScheme="gray" fontSize="xs" px={1.5} py={0.5} borderRadius="4px">{p}</Badge>
                      ))}
                    </Flex>
                  </Td>
                  <Td>
                    <Flex align="center" gap={1}>
                      <Badge colorScheme={STATUS_COLOR[user.status]} fontSize="xs" px={2} py={0.5} borderRadius="4px">
                        {user.status === "Active" ? "Ativo" : user.status === "Inactive" ? "Inativo" : "Pendente"}
                      </Badge>
                      {user.status === "Pending" && user.confirmationCode && (
                        <Tooltip label="Copiar link de primeiro acesso">
                          <IconButton aria-label="Copiar link" icon={<CopyIcon />} size="xs" variant="ghost" colorScheme="yellow" onClick={() => handleCopy(user)} />
                        </Tooltip>
                      )}
                    </Flex>
                  </Td>
                  <Td>
                    <Switch
                      colorScheme="brand"
                      isChecked={user.status === "Active"}
                      isDisabled={user.status === "Pending"}
                      onChange={() => handleToggleStatus(user)}
                      size="sm"
                    />
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <Tooltip label="Editar">
                        <IconButton aria-label="Editar" icon={<EditIcon />} size="sm" variant="outline" colorScheme="brand" onClick={() => openEdit(user)} />
                      </Tooltip>
                      <Tooltip label="Excluir">
                        <IconButton aria-label="Excluir" icon={<DeleteIcon />} size="sm" variant="outline" colorScheme="red" onClick={() => openDelete(user)} />
                      </Tooltip>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* CREATE MODAL */}
      <Modal isOpen={createModal.isOpen} onClose={createModal.onClose} size="md">
        <ModalOverlay />
        <ModalContent bg="#141414" border="1px solid #2D2D2D">
          <ModalHeader color="white">Novo Usuário</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel color="#AAA" fontSize="sm">Nome completo</FormLabel>
                <Input placeholder="Ex: João Silva" value={newUser.name} onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel color="#AAA" fontSize="sm">E-mail</FormLabel>
                <Input type="email" placeholder="joao@empresa.com" value={newUser.email} onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))} />
              </FormControl>
              <FormControl>
                <FormLabel color="#AAA" fontSize="sm">Perfil de acesso</FormLabel>
                <Select value={newUser.role} onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value }))}>
                  <option value="admin">Administrador — acesso total</option>
                  <option value="manager">Gerente — pode editar, não excluir usuários</option>
                  <option value="viewer">Visualizador — somente leitura</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel color="#AAA" fontSize="sm">Páginas com acesso</FormLabel>
                <CheckboxGroup value={newUser.permissions} onChange={(vals) => setNewUser((p) => ({ ...p, permissions: vals as string[] }))}>
                  <Stack spacing={2}>
                    {PERMISSION_OPTIONS.map((opt) => (
                      <Checkbox key={opt.value} value={opt.value} colorScheme="brand">
                        <Text fontSize="sm" color="white">{opt.label}</Text>
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </FormControl>
              <Box bg="rgba(227,0,27,0.07)" border="1px solid rgba(227,0,27,0.2)" borderRadius="8px" p={3}>
                <Text fontSize="xs" color="#888">Um link de primeiro acesso será gerado. Copie e envie para o usuário definir a senha.</Text>
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" colorScheme="whiteAlpha" onClick={createModal.onClose}>Cancelar</Button>
            <Button colorScheme="brand" onClick={handleCreate} isLoading={submitting}>Criar Usuário</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.onClose} size="md">
        <ModalOverlay />
        <ModalContent bg="#141414" border="1px solid #2D2D2D">
          <ModalHeader color="white">Editar Usuário</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel color="#AAA" fontSize="sm">Nome</FormLabel>
                <Input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} />
              </FormControl>
              <FormControl>
                <FormLabel color="#AAA" fontSize="sm">E-mail (não editável)</FormLabel>
                <Input value={editingUser?.email || ""} isDisabled opacity={0.5} />
              </FormControl>
              <FormControl>
                <FormLabel color="#AAA" fontSize="sm">Perfil de acesso</FormLabel>
                <Select value={editForm.role} onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))}>
                  <option value="admin">Administrador — acesso total</option>
                  <option value="manager">Gerente — pode editar, não excluir usuários</option>
                  <option value="viewer">Visualizador — somente leitura</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel color="#AAA" fontSize="sm">Páginas com acesso</FormLabel>
                <CheckboxGroup value={editForm.permissions} onChange={(vals) => setEditForm((p) => ({ ...p, permissions: vals as string[] }))}>
                  <Stack spacing={2}>
                    {PERMISSION_OPTIONS.map((opt) => (
                      <Checkbox key={opt.value} value={opt.value} colorScheme="brand">
                        <Text fontSize="sm" color="white">{opt.label}</Text>
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" colorScheme="whiteAlpha" onClick={editModal.onClose}>Cancelar</Button>
            <Button colorScheme="brand" onClick={handleEdit} isLoading={submitting}>Salvar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* DELETE DIALOG */}
      <AlertDialog isOpen={deleteDialog.isOpen} leastDestructiveRef={cancelRef} onClose={deleteDialog.onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent bg="#141414" border="1px solid #2D2D2D">
            <AlertDialogHeader color="white" fontSize="lg" fontWeight={700}>Excluir Usuário</AlertDialogHeader>
            <AlertDialogBody color="#AAA">
              Tem certeza que deseja excluir <Text as="span" color="white" fontWeight={600}>{deletingUser?.name}</Text>? Esta ação não pode ser desfeita.
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button ref={cancelRef} variant="ghost" colorScheme="whiteAlpha" onClick={deleteDialog.onClose}>Cancelar</Button>
              <Button colorScheme="red" onClick={handleDelete} isLoading={submitting}>Excluir</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
}
