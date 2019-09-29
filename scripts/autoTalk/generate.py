from textgenrnn import textgenrnn
import json
"""
textgen = textgenrnn(weights_path='textgenrnn_weights.hdf5',
					 vocab_path='textgenrnn_vocab.json',
					 config_path='textgenrnn_config.json')
"""

textgen = textgenrnn(weights_path='./autoTalk/data26.09.2019/textgenrnn_weights.hdf5',
					 vocab_path='./autoTalk/data26.09.2019/textgenrnn_vocab.json',
					 config_path='./autoTalk/data26.09.2019/textgenrnn_config.json')

messages = textgen.generate(n=50, temperature=1.3, max_gen_length=300, return_as_list=True)

txt = json.dumps(messages);
#print(txt);
with open('output.json', 'wb') as fh:
    fh.write(txt.encode());

"""
txt = "\n".join(messages)
print(txt)
"""