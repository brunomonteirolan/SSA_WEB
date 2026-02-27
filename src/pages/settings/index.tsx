import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Button, Flex, Text, FormControl, FormLabel, Input, Switch,
  Stack, Divider, Spinner, Center, useToast, Tooltip, InputGroup,
  InputRightElement, IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import Container from "../../components/Container";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface SettingsForm {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  smtpFrom: string;
  smtpSecure: boolean;
  clientDownloadUrl: string;
  siteName: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailAddr, setTestEmailAddr] = useState("");

  const [form, setForm] = useState<SettingsForm>({
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    smtpFrom: "",
    smtpSecure: false,
    clientDownloadUrl: "",
    siteName: "Sacoa Super App",
  });

  // Admin-only guard
  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.replace("/");
    }
  }, [status, session, router]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/settings");
      const s = data.settings;
      setForm({
        smtpHost: s.smtpHost || "",
        smtpPort: String(s.smtpPort || 587),
        smtpUser: s.smtpUser || "",
        smtpPassword: s.smtpPassword || "",
        smtpFrom: s.smtpFrom || "",
        smtpSecure: s.smtpSecure ?? false,
        clientDownloadUrl: s.clientDownloadUrl || "",
        siteName: s.siteName || "Sacoa Super App",
      });
    } catch (err: any) {
      toast({ status: "error", description: err.response?.data?.message || "Erro ao carregar configurações" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      fetchSettings();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.patch("/api/settings", {
        ...form,
        smtpPort: Number(form.smtpPort),
      });
      toast({ status: "success", description: "Configurações salvas com sucesso!" });
    } catch (err: any) {
      toast({ status: "error", description: err.response?.data?.message || "Erro ao salvar configurações" });
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmailAddr) return toast({ status: "warning", description: "Informe um e-mail para teste" });
    setTestingEmail(true);
    try {
      await axios.post("/api/settings/test-email", { email: testEmailAddr });
      toast({ status: "success", description: `E-mail de teste enviado para ${testEmailAddr}` });
    } catch (err: any) {
      toast({ status: "error", description: err.response?.data?.message || "Erro ao enviar e-mail de teste" });
    } finally {
      setTestingEmail(false);
    }
  };

  const set = (field: keyof SettingsForm, value: string | boolean) =>
    setForm((p) => ({ ...p, [field]: value }));

  if (status === "loading" || loading) {
    return (
      <Container pageTitle="Configurações">
        <Center py={20}><Spinner color="#E3001B" size="lg" /></Center>
      </Container>
    );
  }

  return (
    <Container pageTitle="Configurações">
      <Flex align="center" justify="space-between" mb={6}>
        <Box>
          <Text fontSize="xl" fontWeight={700} color="white">Configurações do Sistema</Text>
          <Text fontSize="sm" color="#666">Configurações de e-mail, download e site</Text>
        </Box>
        <Button colorScheme="brand" onClick={handleSave} isLoading={saving} size="sm">
          Salvar Configurações
        </Button>
      </Flex>

      <Stack spacing={6}>
        {/* Site settings */}
        <Box bg="#111111" border="1px solid #1F1F1F" borderRadius="12px" p={6}>
          <Text fontSize="md" fontWeight={700} color="white" mb={4}>
            Configurações do Site
          </Text>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel color="#AAA" fontSize="sm">Nome do sistema</FormLabel>
              <Input
                value={form.siteName}
                onChange={(e) => set("siteName", e.target.value)}
                placeholder="Sacoa Super App"
              />
            </FormControl>
            <FormControl>
              <FormLabel color="#AAA" fontSize="sm">URL de download do cliente SSA</FormLabel>
              <Input
                value={form.clientDownloadUrl}
                onChange={(e) => set("clientDownloadUrl", e.target.value)}
                placeholder="https://exemplo.com/ssa-client-setup.exe"
              />
              <Text fontSize="xs" color="#555" mt={1}>
                Link direto para o instalador do SSA-Client. Usado pelo botão "Baixar cliente".
              </Text>
            </FormControl>
          </Stack>
        </Box>

        {/* SMTP Settings */}
        <Box bg="#111111" border="1px solid #1F1F1F" borderRadius="12px" p={6}>
          <Text fontSize="md" fontWeight={700} color="white" mb={1}>
            Configurações de E-mail (SMTP)
          </Text>
          <Text fontSize="sm" color="#666" mb={4}>
            Usado para enviar o e-mail de ativação quando um novo usuário é criado.
          </Text>

          <Stack spacing={4}>
            <Flex gap={4} direction={{ base: "column", md: "row" }}>
              <FormControl flex={2}>
                <FormLabel color="#AAA" fontSize="sm">Servidor SMTP (Host)</FormLabel>
                <Input
                  value={form.smtpHost}
                  onChange={(e) => set("smtpHost", e.target.value)}
                  placeholder="smtp.gmail.com"
                />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel color="#AAA" fontSize="sm">Porta</FormLabel>
                <Input
                  value={form.smtpPort}
                  onChange={(e) => set("smtpPort", e.target.value)}
                  placeholder="587"
                  type="number"
                />
              </FormControl>
            </Flex>

            <FormControl>
              <Flex align="center" justify="space-between" mb={1}>
                <FormLabel color="#AAA" fontSize="sm" mb={0}>Usar SSL/TLS (porta 465)</FormLabel>
                <Switch
                  colorScheme="brand"
                  isChecked={form.smtpSecure}
                  onChange={(e) => set("smtpSecure", e.target.checked)}
                />
              </Flex>
            </FormControl>

            <Divider borderColor="#2D2D2D" />

            <FormControl>
              <FormLabel color="#AAA" fontSize="sm">Usuário / E-mail da conta</FormLabel>
              <Input
                value={form.smtpUser}
                onChange={(e) => set("smtpUser", e.target.value)}
                placeholder="usuario@gmail.com"
              />
            </FormControl>

            <FormControl>
              <FormLabel color="#AAA" fontSize="sm">Senha do SMTP</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.smtpPassword}
                  onChange={(e) => set("smtpPassword", e.target.value)}
                  placeholder="Senha ou App Password"
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? "Ocultar" : "Mostrar"}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="whiteAlpha"
                    onClick={() => setShowPassword((p) => !p)}
                  />
                </InputRightElement>
              </InputGroup>
              <Text fontSize="xs" color="#555" mt={1}>
                Para Gmail, use uma "Senha de app" nas configurações de segurança do Google.
              </Text>
            </FormControl>

            <FormControl>
              <FormLabel color="#AAA" fontSize="sm">E-mail de envio (From)</FormLabel>
              <Input
                value={form.smtpFrom}
                onChange={(e) => set("smtpFrom", e.target.value)}
                placeholder="noreply@sacoa.com"
              />
            </FormControl>

            <Divider borderColor="#2D2D2D" />

            {/* Test email */}
            <Box>
              <Text fontSize="sm" fontWeight={600} color="white" mb={2}>Testar configuração de e-mail</Text>
              <Flex gap={2}>
                <Input
                  flex={1}
                  value={testEmailAddr}
                  onChange={(e) => setTestEmailAddr(e.target.value)}
                  placeholder="seu@email.com"
                  size="sm"
                />
                <Button
                  size="sm"
                  colorScheme="brand"
                  variant="outline"
                  onClick={handleTestEmail}
                  isLoading={testingEmail}
                  minW="140px"
                >
                  Enviar teste
                </Button>
              </Flex>
            </Box>
          </Stack>
        </Box>

        <Flex justify="flex-end">
          <Button colorScheme="brand" onClick={handleSave} isLoading={saving} size="md" px={8}>
            Salvar todas as configurações
          </Button>
        </Flex>
      </Stack>
    </Container>
  );
}
