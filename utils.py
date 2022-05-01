from datetime import datetime as dt
import json
import js
import time

def get_element_by_id(element_id):
    return js.document.getElementById(element_id)

def clog(o):
    if type(o) == dict:
        o = json.dumps(o)
    js.console.log(o)

def read_file(file, file_read_callback, read_method='readAsDataURL'):
    reader = js.FileReader.new()
    async def file_reader_callback(*args,**kwargs):
        await file_read_callback(reader.result)
    if read_method == 'readAsDataURL': reader.readAsDataURL(file)
    else: raise NotImplementedError()
    reader.onloadend = file_reader_callback

def process_file_selector_files_by_element_id(element_id,process_file_callback,read_method='readAsDataURL'):
    file_selector = get_element_by_id(element_id=element_id)
    for file in file_selector.files:
        read_file(file,process_file_callback, read_method=read_method)

def create_element(element_type):
    return js.document.createElement(element_type)

def break_element():
    return create_element('br')
