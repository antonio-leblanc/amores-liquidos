import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from utils import slugify, normalize_song_title, slug_to_title, format_instrument_name


class TestSlugify(unittest.TestCase):

    def test_acentos(self):
        self.assertEqual(slugify("Água de Chuva no Mar"), "agua_de_chuva_no_mar")
        self.assertEqual(slugify("São João"), "sao_joao")
        self.assertEqual(slugify("Anúncio!"), "anuncio")

    def test_percentual(self):
        # '%' vira 'porcento' colado ao caractere anterior, sem separador.
        self.assertEqual(slugify("100% Você"), "100porcento_voce")

    def test_apostrofo_e_pontuacao_sao_removidos(self):
        self.assertEqual(slugify("Ai Que Saudade D'Ocê"), "ai_que_saudade_doce")

    def test_barra_vira_underscore_duplo(self):
        self.assertEqual(slugify("Trompete / Tenor"), "trompete___tenor")

    def test_espacos_multiplos_colapsam(self):
        self.assertEqual(slugify("  Espaços   Extras  "), "espacos_extras")


class TestNormalizeSongTitle(unittest.TestCase):

    def test_remove_titulo_markdown_e_instrumento(self):
        self.assertEqual(
            normalize_song_title("# Baianidade Nagô - Sax Alto"),
            "baianidade nagô",
        )

    def test_remove_negrito(self):
        self.assertEqual(normalize_song_title("**Trombone**"), "trombone")

    def test_remove_instrumento_entre_parenteses(self):
        self.assertEqual(
            normalize_song_title("Título Da Música (Trompete/Tenor)"),
            "título da música",
        )

    def test_remove_bloco_chave_final(self):
        self.assertEqual(
            normalize_song_title("# Nome Qualquer {.something}"),
            "nome qualquer",
        )

    def test_titulo_sem_instrumento_fica_intacto(self):
        self.assertEqual(normalize_song_title("Amor Perfeito"), "amor perfeito")


class TestSlugToTitle(unittest.TestCase):

    def test_basico(self):
        self.assertEqual(slug_to_title("sax_alto"), "Sax Alto")
        self.assertEqual(slug_to_title("dont_stop_michael_jackson"), "Dont Stop Michael Jackson")


class TestFormatInstrumentName(unittest.TestCase):

    def test_mapeamento_explicito(self):
        self.assertEqual(format_instrument_name("sax_alto"), "🎷 Sax Alto")
        self.assertEqual(format_instrument_name("sax_tenor"), "🎷 Sax Tenor")
        self.assertEqual(format_instrument_name("trombone"), "📯 Trombone")
        self.assertEqual(format_instrument_name("trompete___tenor"), "🎺 Trompete / Tenor")
        self.assertEqual(format_instrument_name("bateria"), "🥁 Bateria")

    def test_fallback_generico_sem_emoji(self):
        self.assertEqual(format_instrument_name("clarinete"), "Clarinete")


if __name__ == "__main__":
    unittest.main()
