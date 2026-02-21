import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Button, Flex, Text, Badge, IconButton, useToast,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  FormControl, FormLabel, Input, Select, Textarea, Switch,
  Table, Thead, Tbody, Tr, Th, Td, Tooltip, useDisclosure,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay, Spinner, Center, Grid, GridItem,
  Divider, Tag,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, ChevronRightIcon, ArrowBackIcon } from "@chakra-ui/icons";
import Container from "../../components/Container";

interface AppRow {
  _id: string;
  name: string;
  displayName: string;
  description?: string;
  status: "active" | "inactive";
  currentVersion?: string;
  createdAt: string;
}

interface AppVersion {
  _id: string;
  app: string;
  version: string;
  name: string;
  releaseDate: string;
  notes?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  status: "active" | "inactive";
  createdAt: string;
}

const STATUS_COLOR: Record<string, string> = { active: "green", inactive: "red" };
const STATUS_LABEL: Record<string, string> = { active: "Ativo", inactive: "Inativo" };

function slugify(str: string) {
  return str.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function AppsPage() {
  const toast = useToast();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  // APPS state
  const [apps, setApps] = useState<AppRow[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // CREATE APP
  const createModal = useDisclosure();
  const [newApp, setNewApp] = useState({ displayName: "", name: "", description: "", status: "active" });

  // EDIT APP
  const editModal = useDisclosure();
  const [editingApp, setEditingApp] = useState<AppRow | null>(null);
  const [editForm, setEditForm] = useState({ displayName: "", name: "", description: "", status: "active" });

  // DELETE APP
  const deleteDialog = useDisclosure();
  const [deletingApp, setDeletingApp] = useState<AppRow | null>(null);

  // VERSION HISTORY VIEW
  const [selectedApp, setSelectedApp] = useState<AppRow | null>(null);
  const [versions, setVersions] = useState<AppVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);

  // CREATE VERSION
  const createVersionModal = useDisclosure();
  const [newVersion, setNewVersion] = useState({
    version: "", name: "", releaseDate: new Date().toISOString().split("T")[0],
    notes: "", fileUrl: "", fileName: "", fileSize: "", status: "active",
  });

  // EDIT VERSION
  const editVersionModal = useDisclosure();
  const [editingVersion, setEditingVersion] = useState<AppVersion | null>(null);
  const [editVersionForm, setEditVersionForm] = useState({
    version: "", name: "", releaseDate: "", notes: "", fileUrl: "", fileName: "", fileSize: "", status: "active",
  });

  // DELETE VERSION
  const deleteVersionDialog = useDisclosure();
  const [deletingVersion, setDeletingVersion] = useState<AppVersion | null>(null);

  // ─── FETCH APPS ────────────────────────────────────────────────────────────
  const fetchApps = async () => {
    setLoadingApps(true);
    try {
      const { data } = await axios.get("/api/apps");
      setApps(data.apps);
    } catch (err: any) {
      toast({ status: "error", description: err.response?.data?.message || "Erro ao carregar apps" });
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => { fetchApps(); }, []);

  // ─── FETCH VERSIONS ────────────────────────────────────────────────────────
  const fetchVersions = async (appId: string) => {
    setLoadingVersions(true);
    try {
      const { data } = await axios.get(`/api/apps/${appId}/versions`);
      setVersions(data.versions);
    } catch (err: any) {
      toast({ status: "error", description: err.response?.data?.message || "Erro ao carregar versões" });
    } finally {
      setLoadingVersions(false);
    }
  };

  const openVersions = (app: AppRow) => {
    setSelectedApp(app);
    setVersions([]);
    fetchVersions(app._id);
  };

  const backToApps = () => {
    setSelectedApp(null);
    setVersions([]);
  };

  // ─── CREATE APP ────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!newApp.displayName.trim()) {
      return toast({ status: "warning", description: "Nome de exibição é obrigatório" });
    }
    const slugName = newApp.name.trim() ? slugify(newApp.name) : slugify(newApp.displayName);
    setSubmitting(true);
    try {
      const { data } = await axios.post("/api/apps", {
        displayName: newApp.displayName.trim(),
        name: slugName,
        description: newApp.description.trim() || undefined,
        status: newApp.status,
      });
      toast({ status: "success", description: "Aplicativo criado com sucesso!" });
      setApps((prev) => [data.app, ...prev]);
      setNewApp({ displayName: "", name: "", description: "", status: "active" });
      createModal.onClose();
    } catch (err: any) {
      toast({ status: "error", description: err.response?.data?.message || "Erro ao criar app" });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── EDIT APP ──────────────────────────────────────────────────────────────
  const openEdit = (app: AppRow) => {
    setEditingApp(app);
    setEditForm({ displayName: app.displayName, name: app.name, description: app.description || "", status: app.status });
    editModal.onOpen();
  };

  const handleEdit = async () => {
    if (!editingApp) return;
    setSubmitting(true);
    try {
      const { data } = await axios.patch(`/api/apps/${editingApp._id}`, {
        displayName: editForm.displayName.trim(),
        name: slugify(editForm.name || editForm.displayName),
        description: editForm.description.trim() || undefined,
        status: editForm.status,
      });
      toast({ status: "success", description: "Aplicativo atualizado!" });
      setApps((prev) => prev.map((a) => (a._id === editingApp._id ? { ...a, ...data.app } : a)));
      if (selectedApp?._id === editingApp._id) setSelectedApp((s) => s ? { ...s, ...data.app } : s);
      editModal.onClose();
    } catch (err: any) {
      toast({ status: "error", description: err.response?.data?.message || "Erro ao editar app" });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── TOGGLE APP STATUS ─────────────────────────────────────────────────────
  const handleToggleApp = async (app: AppRow) => {
    const newStatus = app.status === "active" ? "inactive" : "active";
    try {
      await axios.patch(`/api/apps/${app._id}`, { status: newStatus });
      toast({ status: "success", description: `App ${newStatus === "active" ? "ativado" : "desativado"}!` });
      setApps((prev) => prev.map((a) => (a._id === app._id ? { ...a, status: newStatus } : a)));
      if (selectedApp?._id === app._id) setSelectedApp((s) => s ? { ...s, status: newStatus } : s);
    } catch (err: any) {
      toast({ status: "error", description: err.response?.data?.message || "Erro ao alterar status" });
    }
  };

  // ─── DELETE APP ────────────────────────────────────────────────────────────
  const openDelete = (app: AppRow) => {
    setDeletingApp(app);
    deleteDialog.onOpen();
  };

  const handleDelete = async () => {
    if (!deletingApp) return;
    setSubmitting(true);
    try {
      await axios.delete(`/api/apps/${deletingApp._id}`);
      toast({ status: "success", description: "Aplicativo excluído!" });
      setApps((prev) => prev.filter((a) => a._id !== deletingApp._id));
      if (selectedApp?._id === deletingApp._id) backToApps();
      deleteDialog.onClose();
    } catch (err: any) {
      toast({ status: "error", description: err.response?.data?.message || "Erro ao excluir app" });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── CREATE VERSION ────────────────────────────────────────────────────────
  const handleCreateVersion = async () => {
    if (!selectedApp) return;
    if (!newVersion.version.trim() || !newVersion.name.trim() || !newVersion.releaseDate) {
      return toast({ status: "warning", description: "Versão, nome e data de lançamento são obrigatórios" });
    }
    setSubmitting(true);
    try {
      const { data } = await axios.post(`/api/apps/${selectedApp._id}/versions`, {
        version: newVersion.version.trim(),
        name: newVersion.name.trim(),
        releaseDate: newVersion.releaseDate,
        notes: newVersion.notes.trim() || undefined,
        fileUrl: newVersion.fileUrl.trim() || undefined,
        fileName: newVersion.fileName.trim() || undefined,
        fileSize: newVersion.fileSize.trim() || undefined,
        status: newVersion.status,
      });
      toast({ status: "success", description: "Versão adicionada!" });
      setVersions((prev) => [data.version, ...prev]);
      setApps((prev) => prev.map((a) => a._id === selectedApp._id ? { ...a, currentVersion: newVersion.version.trim() } : a));
      setSelectedApp((s) => s ? { ...s, currentVersion: newVersion.version.trim() } : s);
      setNewVersion({ version: "", name: "", releaseDate: new Date().toISOString().split("T")[0], notes: "", fileUrl: "", fileName: "", fileSize: "", status: "active" });
      createVersionModal.onClose();
    } catch (err: any) {
      toast({ status: "error", description: err.response?.data?.message || "Erro ao criar versão" });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── EDIT VERSION ──────────────────────────────────────────────────────────
  const openEditVersion = (v: AppVersion) => {
    setEditingVersion(v);
    setEditVersionForm({
      version: v.version, name: v.name,
      releaseDate: v.releaseDate ? v.releaseDate.split("T")[0] : "",
      notes: v.notes || "", fileUrl: v.fileUrl || "",
      fileName: v.fileName || "", fileSize: v.fileSize || "",
      status: v.status,
    });
    editVersionModal.onOpen();
  };

  const handleEditVersion = async () => {
    if (!editingVersion || !selectedApp) return;
    setSubmitting(true);
    try {
      const { data } = await axios.patch(`/api/apps/${selectedApp._id}/versions/${editingVersion._id}`, {
        version: editVersionForm.version.trim(),
        name: editVersionForm.name.trim(),
        releaseDate: editVersionForm.releaseDate,
        notes: editVersionForm.notes.trim() || undefined,
        fileUrl: editVersionForm.fileUrl.trim() || undefined,
        fileName: editVersionForm.fileName.trim() || undefined,
        fileSize: editVersionForm.fileSize.trim() || undefined,
        status: editVersionForm.status,
      });
      toast({ status: "success", description: "Versão atualizada!" });
      setVersions((prev) => prev.map((v) => v._id === editingVersion._id ? { ...v, ...data.version } : v));
      editVersionModal.onClose();
    } catch (err: any) {
      toast({ status: "error", description: err.response?.data?.message || "Erro ao editar versão" });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── DELETE VERSION ────────────────────────────────────────────────────────
  const openDeleteVersion = (v: AppVersion) => {
    setDeletingVersion(v);
    deleteVersionDialog.onOpen();
  };

  const handleDeleteVersion = async () => {
    if (!deletingVersion || !selectedApp) return;
    setSubmitting(true);
    try {
      await axios.delete(`/api/apps/${selectedApp._id}/versions/${deletingVersion._id}`);
      toast({ status: "success", description: "Versão excluída!" });
      setVersions((prev) => prev.filter((v) => v._id !== deletingVersion._id));
      deleteVersionDialog.onClose();
    } catch (err: any) {
      toast({ status: "error", description: err.response?.data?.message || "Erro ao excluir versão" });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <Container pageTitle="Aplicativos">
      {/* ── VERSION HISTORY VIEW ── */}
      {selectedApp ? (
        <>
          <Flex align="center" justify="space-between" mb={6}>
            <Flex align="center" gap={3}>
              <IconButton
                aria-label="Voltar"
                icon={<ArrowBackIcon />}
                size="sm"
                variant="outline"
                colorScheme="whiteAlpha"
                onClick={backToApps}
              />
              <Box>
                <Flex align="center" gap={2}>
                  <Text fontSize="xl" fontWeight={700} color="white">{selectedApp.displayName}</Text>
                  <Badge colorScheme={STATUS_COLOR[selectedApp.status]} fontSize="xs">{STATUS_LABEL[selectedApp.status]}</Badge>
                  {selectedApp.currentVersion && (
                    <Tag size="sm" bg="#1F1F1F" color="#AAA" fontSize="xs">v{selectedApp.currentVersion}</Tag>
                  )}
                </Flex>
                <Text fontSize="sm" color="#666">{versions.length} versão{versions.length !== 1 ? "ões" : ""} encontrada{versions.length !== 1 ? "s" : ""}</Text>
              </Box>
            </Flex>
            <Flex gap={2}>
              <Tooltip label="Editar app">
                <IconButton aria-label="Editar app" icon={<EditIcon />} size="sm" variant="outline" colorScheme="brand" onClick={() => openEdit(selectedApp)} />
              </Tooltip>
              <Button leftIcon={<AddIcon />} colorScheme="brand" size="sm" onClick={createVersionModal.onOpen}>
                Nova Versão
              </Button>
            </Flex>
          </Flex>

          {loadingVersions ? (
            <Center py={20}><Spinner color="#E3001B" size="lg" /></Center>
          ) : versions.length === 0 ? (
            <Center py={20} flexDir="column" gap={3}>
              <Text color="#555" fontSize="lg">Nenhuma versão cadastrada</Text>
              <Button size="sm" colorScheme="brand" onClick={createVersionModal.onOpen}>Adicionar primeira versão</Button>
            </Center>
          ) : (
            <Box bg="#111111" border="1px solid #1F1F1F" borderRadius="12px" overflow="hidden">
              <Table variant="simple">
                <Thead>
                  <Tr bg="#0D0D0D">
                    <Th>Versão</Th>
                    <Th>Nome</Th>
                    <Th>Data de Lançamento</Th>
                    <Th>Arquivo</Th>
                    <Th>Status</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {versions.map((v) => (
                    <Tr key={v._id} _hover={{ bg: "#161616" }} transition="bg 0.15s">
                      <Td>
                        <Text fontWeight={700} color="#E3001B" fontSize="sm" fontFamily="mono">v{v.version}</Text>
                      </Td>
                      <Td>
                        <Text fontWeight={600} color="white" fontSize="sm">{v.name}</Text>
                        {v.notes && (
                          <Text fontSize="xs" color="#666" noOfLines={1} mt={0.5}>{v.notes}</Text>
                        )}
                      </Td>
                      <Td>
                        <Text color="#AAA" fontSize="sm">
                          {v.releaseDate ? new Date(v.releaseDate).toLocaleDateString("pt-BR") : "—"}
                        </Text>
                      </Td>
                      <Td>
                        {v.fileUrl ? (
                          <Flex direction="column" gap={0.5}>
                            <Button
                              as="a"
                              href={v.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="xs"
                              variant="outline"
                              colorScheme="brand"
                              maxW="160px"
                            >
                              {v.fileName || "Download"}
                            </Button>
                            {v.fileSize && <Text fontSize="xs" color="#555">{v.fileSize}</Text>}
                          </Flex>
                        ) : (
                          <Text color="#444" fontSize="xs">Sem arquivo</Text>
                        )}
                      </Td>
                      <Td>
                        <Badge colorScheme={STATUS_COLOR[v.status]} fontSize="xs" px={2} py={0.5} borderRadius="4px">
                          {STATUS_LABEL[v.status]}
                        </Badge>
                      </Td>
                      <Td>
                        <Flex gap={2}>
                          <Tooltip label="Editar versão">
                            <IconButton aria-label="Editar versão" icon={<EditIcon />} size="sm" variant="outline" colorScheme="brand" onClick={() => openEditVersion(v)} />
                          </Tooltip>
                          <Tooltip label="Excluir versão">
                            <IconButton aria-label="Excluir versão" icon={<DeleteIcon />} size="sm" variant="outline" colorScheme="red" onClick={() => openDeleteVersion(v)} />
                          </Tooltip>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </>
      ) : (
        /* ── APPS LIST VIEW ── */
        <>
          <Flex align="center" justify="space-between" mb={6}>
            <Box>
              <Text fontSize="xl" fontWeight={700} color="white">Aplicativos</Text>
              <Text fontSize="sm" color="#666">{apps.length} aplicativo{apps.length !== 1 ? "s" : ""} cadastrado{apps.length !== 1 ? "s" : ""}</Text>
            </Box>
            <Button leftIcon={<AddIcon />} colorScheme="brand" size="sm" onClick={createModal.onOpen}>
              Novo App
            </Button>
          </Flex>

          {loadingApps ? (
            <Center py={20}><Spinner color="#E3001B" size="lg" /></Center>
          ) : apps.length === 0 ? (
            <Center py={20} flexDir="column" gap={3}>
              <Text color="#555" fontSize="lg">Nenhum aplicativo cadastrado</Text>
              <Button size="sm" colorScheme="brand" onClick={createModal.onOpen}>Criar primeiro app</Button>
            </Center>
          ) : (
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
              {apps.map((app) => (
                <GridItem key={app._id}>
                  <Box
                    bg="#111111"
                    border="1px solid #1F1F1F"
                    borderRadius="12px"
                    p={5}
                    _hover={{ borderColor: "#333", transform: "translateY(-1px)" }}
                    transition="all 0.15s"
                  >
                    {/* Card header */}
                    <Flex align="flex-start" justify="space-between" mb={3}>
                      <Box flex={1} mr={2}>
                        <Text fontWeight={700} color="white" fontSize="md" noOfLines={1}>{app.displayName}</Text>
                        <Text fontSize="xs" color="#555" fontFamily="mono">{app.name}</Text>
                      </Box>
                      <Switch
                        colorScheme="brand"
                        isChecked={app.status === "active"}
                        onChange={() => handleToggleApp(app)}
                        size="sm"
                        mt={1}
                      />
                    </Flex>

                    {/* Description */}
                    {app.description && (
                      <Text fontSize="sm" color="#888" noOfLines={2} mb={3}>{app.description}</Text>
                    )}

                    {/* Version + status */}
                    <Flex align="center" gap={2} mb={4}>
                      <Badge colorScheme={STATUS_COLOR[app.status]} fontSize="xs" px={2} py={0.5} borderRadius="4px">
                        {STATUS_LABEL[app.status]}
                      </Badge>
                      {app.currentVersion && (
                        <Tag size="sm" bg="#1A1A1A" color="#E3001B" fontSize="xs" fontFamily="mono" border="1px solid #2D2D2D">
                          v{app.currentVersion}
                        </Tag>
                      )}
                    </Flex>

                    <Divider borderColor="#1F1F1F" mb={4} />

                    {/* Actions */}
                    <Flex gap={2}>
                      <Button
                        size="xs"
                        colorScheme="brand"
                        variant="solid"
                        rightIcon={<ChevronRightIcon />}
                        onClick={() => openVersions(app)}
                        flex={1}
                      >
                        Versões
                      </Button>
                      <Tooltip label="Editar app">
                        <IconButton aria-label="Editar" icon={<EditIcon />} size="xs" variant="outline" colorScheme="brand" onClick={() => openEdit(app)} />
                      </Tooltip>
                      <Tooltip label="Excluir app">
                        <IconButton aria-label="Excluir" icon={<DeleteIcon />} size="xs" variant="outline" colorScheme="red" onClick={() => openDelete(app)} />
                      </Tooltip>
                    </Flex>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* ══ CREATE APP MODAL ══ */}
      <Modal isOpen={createModal.isOpen} onClose={createModal.onClose} size="md">
        <ModalOverlay />
        <ModalContent bg="#141414" border="1px solid #2D2D2D">
          <ModalHeader color="white">Novo Aplicativo</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <Flex direction="column" gap={4}>
              <FormControl isRequired>
                <FormLabel color="#AAA" fontSize="sm">Nome de exibição</FormLabel>
                <Input
                  placeholder="Ex: Sacoa Manager"
                  value={newApp.displayName}
                  onChange={(e) => {
                    const v = e.target.value;
                    setNewApp((p) => ({ ...p, displayName: v, name: slugify(v) }));
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel color="#AAA" fontSize="sm">Identificador (slug)</FormLabel>
                <Input
                  placeholder="sacoa-manager"
                  value={newApp.name}
                  onChange={(e) => setNewApp((p) => ({ ...p, name: slugify(e.target.value) }))}
                  fontFamily="mono"
                  fontSize="sm"
                />
              </FormControl>
              <FormControl>
                <FormLabel color="#AAA" fontSize="sm">Descrição</FormLabel>
                <Textarea
                  placeholder="Descreva o aplicativo..."
                  value={newApp.description}
                  onChange={(e) => setNewApp((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  resize="none"
                />
              </FormControl>
              <FormControl>
                <FormLabel color="#AAA" fontSize="sm">Status</FormLabel>
                <Select value={newApp.status} onChange={(e) => setNewApp((p) => ({ ...p, status: e.target.value }))}>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </Select>
              </FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" colorScheme="whiteAlpha" onClick={createModal.onClose}>Cancelar</Button>
            <Button colorScheme="brand" onClick={handleCreate} isLoading={submitting}>Criar App</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ══ EDIT APP MODAL ══ */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.onClose} size="md">
        <ModalOverlay />
        <ModalContent bg="#141414" border="1px solid #2D2D2D">
          <ModalHeader color="white">Editar Aplicativo</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <Flex direction="column" gap={4}>
              <FormControl isRequired>
                <FormLabel color="#AAA" fontSize="sm">Nome de exibição</FormLabel>
                <Input value={editForm.displayName} onChange={(e) => setEditForm((p) => ({ ...p, displayName: e.target.value }))} />
              </FormControl>
              <FormControl>
                <FormLabel color="#AAA" fontSize="sm">Identificador (slug)</FormLabel>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: slugify(e.target.value) }))}
                  fontFamily="mono"
                  fontSize="sm"
                />
              </FormControl>
              <FormControl>
                <FormLabel color="#AAA" fontSize="sm">Descrição</FormLabel>
                <Textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  resize="none"
                />
              </FormControl>
              <FormControl>
                <FormLabel color="#AAA" fontSize="sm">Status</FormLabel>
                <Select value={editForm.status} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </Select>
              </FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" colorScheme="whiteAlpha" onClick={editModal.onClose}>Cancelar</Button>
            <Button colorScheme="brand" onClick={handleEdit} isLoading={submitting}>Salvar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ══ DELETE APP DIALOG ══ */}
      <AlertDialog isOpen={deleteDialog.isOpen} leastDestructiveRef={cancelRef} onClose={deleteDialog.onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent bg="#141414" border="1px solid #2D2D2D">
            <AlertDialogHeader color="white" fontSize="lg" fontWeight={700}>Excluir Aplicativo</AlertDialogHeader>
            <AlertDialogBody color="#AAA">
              Tem certeza que deseja excluir <Text as="span" color="white" fontWeight={600}>{deletingApp?.displayName}</Text>? Todas as versões também serão excluídas. Esta ação não pode ser desfeita.
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button ref={cancelRef} variant="ghost" colorScheme="whiteAlpha" onClick={deleteDialog.onClose}>Cancelar</Button>
              <Button colorScheme="red" onClick={handleDelete} isLoading={submitting}>Excluir</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* ══ CREATE VERSION MODAL ══ */}
      <Modal isOpen={createVersionModal.isOpen} onClose={createVersionModal.onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg="#141414" border="1px solid #2D2D2D">
          <ModalHeader color="white">Nova Versão — {selectedApp?.displayName}</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <Grid templateColumns="1fr 1fr" gap={4}>
              <FormControl isRequired>
                <FormLabel color="#AAA" fontSize="sm">Número da versão</FormLabel>
                <Input
                  placeholder="Ex: 2.1.0"
                  value={newVersion.version}
                  onChange={(e) => setNewVersion((p) => ({ ...p, version: e.target.value }))}
                  fontFamily="mono"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel color="#AAA" fontSize="sm">Nome da versão</FormLabel>
                <Input
                  placeholder="Ex: Atualização de segurança"
                  value={newVersion.name}
                  onChange={(e) => setNewVersion((p) => ({ ...p, name: e.target.value }))}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel color="#AAA" fontSize="sm">Data de lançamento</FormLabel>
                <Input
                  type="date"
                  value={newVersion.releaseDate}
                  onChange={(e) => setNewVersion((p) => ({ ...p, releaseDate: e.target.value }))}
                />
              </FormControl>
              <FormControl>
                <FormLabel color="#AAA" fontSize="sm">Status</FormLabel>
                <Select value={newVersion.status} onChange={(e) => setNewVersion((p) => ({ ...p, status: e.target.value }))}>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </Select>
              </FormControl>
              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel color="#AAA" fontSize="sm">Notas de versão</FormLabel>
                  <Textarea
                    placeholder="Descreva as mudanças nesta versão..."
                    value={newVersion.notes}
                    onChange={(e) => setNewVersion((p) => ({ ...p, notes: e.target.value }))}
                    rows={3}
                    resize="none"
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={2}>
                <Divider borderColor="#2D2D2D" my={1} />
                <Text fontSize="xs" color="#555" mb={3}>Arquivo do aplicativo (opcional)</Text>
              </GridItem>
              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel color="#AAA" fontSize="sm">URL do arquivo</FormLabel>
                  <Input
                    placeholder="https://storage.example.com/app-v2.1.0.apk"
                    value={newVersion.fileUrl}
                    onChange={(e) => setNewVersion((p) => ({ ...p, fileUrl: e.target.value }))}
                  />
                </FormControl>
              </GridItem>
              <FormControl>
                <FormLabel color="#AAA" fontSize="sm">Nome do arquivo</FormLabel>
                <Input
                  placeholder="app-v2.1.0.apk"
                  value={newVersion.fileName}
                  onChange={(e) => setNewVersion((p) => ({ ...p, fileName: e.target.value }))}
                />
              </FormControl>
              <FormControl>
                <FormLabel color="#AAA" fontSize="sm">Tamanho do arquivo</FormLabel>
                <Input
                  placeholder="Ex: 45.2 MB"
                  value={newVersion.fileSize}
                  onChange={(e) => setNewVersion((p) => ({ ...p, fileSize: e.target.value }))}
                />
              </FormControl>
            </Grid>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" colorScheme="whiteAlpha" onClick={createVersionModal.onClose}>Cancelar</Button>
            <Button colorScheme="brand" onClick={handleCreateVersion} isLoading={submitting}>Adicionar Versão</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ══ EDIT VERSION MODAL ══ */}
      <Modal isOpen={editVersionModal.isOpen} onClose={editVersionModal.onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg="#141414" border="1px solid #2D2D2D">
          <ModalHeader color="white">Editar Versão</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <Grid templateColumns="1fr 1fr" gap={4}>
              <FormControl isRequired>
                <FormLabel color="#AAA" fontSize="sm">Número da versão</FormLabel>
                <Input
                  value={editVersionForm.version}
                  onChange={(e) => setEditVersionForm((p) => ({ ...p, version: e.target.value }))}
                  fontFamily="mono"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel color="#AAA" fontSize="sm">Nome da versão</FormLabel>
                <Input
                  value={editVersionForm.name}
                  onChange={(e) => setEditVersionForm((p) => ({ ...p, name: e.target.value }))}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel color="#AAA" fontSize="sm">Data de lançamento</FormLabel>
                <Input
                  type="date"
                  value={editVersionForm.releaseDate}
                  onChange={(e) => setEditVersionForm((p) => ({ ...p, releaseDate: e.target.value }))}
                />
              </FormControl>
              <FormControl>
                <FormLabel color="#AAA" fontSize="sm">Status</FormLabel>
                <Select value={editVersionForm.status} onChange={(e) => setEditVersionForm((p) => ({ ...p, status: e.target.value }))}>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </Select>
              </FormControl>
              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel color="#AAA" fontSize="sm">Notas de versão</FormLabel>
                  <Textarea
                    value={editVersionForm.notes}
                    onChange={(e) => setEditVersionForm((p) => ({ ...p, notes: e.target.value }))}
                    rows={3}
                    resize="none"
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={2}>
                <Divider borderColor="#2D2D2D" my={1} />
                <Text fontSize="xs" color="#555" mb={3}>Arquivo do aplicativo (opcional)</Text>
              </GridItem>
              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel color="#AAA" fontSize="sm">URL do arquivo</FormLabel>
                  <Input
                    value={editVersionForm.fileUrl}
                    onChange={(e) => setEditVersionForm((p) => ({ ...p, fileUrl: e.target.value }))}
                  />
                </FormControl>
              </GridItem>
              <FormControl>
                <FormLabel color="#AAA" fontSize="sm">Nome do arquivo</FormLabel>
                <Input
                  value={editVersionForm.fileName}
                  onChange={(e) => setEditVersionForm((p) => ({ ...p, fileName: e.target.value }))}
                />
              </FormControl>
              <FormControl>
                <FormLabel color="#AAA" fontSize="sm">Tamanho do arquivo</FormLabel>
                <Input
                  value={editVersionForm.fileSize}
                  onChange={(e) => setEditVersionForm((p) => ({ ...p, fileSize: e.target.value }))}
                />
              </FormControl>
            </Grid>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" colorScheme="whiteAlpha" onClick={editVersionModal.onClose}>Cancelar</Button>
            <Button colorScheme="brand" onClick={handleEditVersion} isLoading={submitting}>Salvar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ══ DELETE VERSION DIALOG ══ */}
      <AlertDialog isOpen={deleteVersionDialog.isOpen} leastDestructiveRef={cancelRef} onClose={deleteVersionDialog.onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent bg="#141414" border="1px solid #2D2D2D">
            <AlertDialogHeader color="white" fontSize="lg" fontWeight={700}>Excluir Versão</AlertDialogHeader>
            <AlertDialogBody color="#AAA">
              Tem certeza que deseja excluir a versão{" "}
              <Text as="span" color="#E3001B" fontWeight={700} fontFamily="mono">v{deletingVersion?.version}</Text>?{" "}
              Esta ação não pode ser desfeita.
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button ref={cancelRef} variant="ghost" colorScheme="whiteAlpha" onClick={deleteVersionDialog.onClose}>Cancelar</Button>
              <Button colorScheme="red" onClick={handleDeleteVersion} isLoading={submitting}>Excluir</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
}
