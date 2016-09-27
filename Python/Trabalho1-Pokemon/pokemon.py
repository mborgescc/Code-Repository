## Trabalhando com grandes volumes de dados (Big Data) - Trabalho 1
## Aluno: Mauricio Borges Pereira Junior
## DRE: 113028131
## Entrega: xx/09/2016
## --> Pergunta: Quais os cinco tipos mais fortes de pokemons?

import csv
import matplotlib.pyplot as plt
import numpy as np
from collections import defaultdict, OrderedDict

types = defaultdict(list)
error_flag = 0

f = csv.reader(open('Pokemon.csv'), delimiter=',')

#Criando dicionario: TIPO => [FORCA TOTAL ACUMULADA , NUMERO DE POKEMONS]
for [ident,name,type1,type2,total,hp,attack,defense,sp_attack,sp_defense,speed,generation,legendary] in f:
   try:
      if type1 in types:
         types[type1][0] += int(total)
         types[type1][1] += 1
      else:
         types[type1] = [int(total),1]
      if type2 != '':
         if type2 in types:
            types[type2][0] += int(total)
            types[type2][1] += 1
         else:
            types[type2] = [int(total),1]
   except ValueError:
      if error_flag == 1:
         print "Houve um erro de leitura. Favor, verificar."
      error_flag += 1

#Divide a forca total acumulada pelo numero de pokemons
for info in types:
   types[info] = types[info][0]/types[info][1]

#Coloca em ordem decrescente
types = OrderedDict(sorted(types.items(), key=lambda t: t[1], reverse = True))

#Gera o grafico de barras
n_groups = 5
types_strength = (types.items()[0][1],) + (types.items()[1][1],) + (types.items()[2][1],) + (types.items()[3][1],) + (types.items()[4][1],)
err = (0, 0, 0, 0, 0)
fig, ax = plt.subplots()
index = np.arange(n_groups)
bar_width = 0.70
opacity = 0.4
error_config = {'ecolor': '0.3'}

rects1 = plt.barh(index, types_strength, bar_width,
                 alpha=opacity,
                 color='r',
                 yerr=err,
                 error_kw=error_config)

plt.xlabel('Strength')
plt.ylabel('Types')
plt.title('Top 5 average strength by pokemon type')
plt.yticks(index + bar_width, (types.items()[0][0],) + (types.items()[1][0],) + (types.items()[2][0],) + (types.items()[3][0],) + (types.items()[4][0],))
plt.legend()

plt.tight_layout()
plt.show()

#print "Average Strength of pokemon type:"
#for info in types:
#   print ">> " + info + ": " + str(types[info])



