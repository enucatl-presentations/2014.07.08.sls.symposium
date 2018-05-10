.PHONY: all clean

all: abstract.pdf

abstract.pdf: abstract.tex library.bib
	latexmk -bibtex -pdf $<

clean:
	rm -rf *.aux *.pdf *.ps *.log *.dvi *.bbl *.blg
