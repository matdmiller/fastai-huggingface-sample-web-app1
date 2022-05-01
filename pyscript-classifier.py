from utils import clog, get_element_by_id, process_file_selector_files_by_element_id, create_element, break_element
import json
import js

API_CLASSIFIER_URL = 'https://hf.space/embed/jph00/testing/+/api/predict/'

results_div = get_element_by_id('results-div')

responses = []

def click_handle(*args,**kwargs):
    clog('click_handle')
    process_file_selector_files_by_element_id('fileUploader',process_file)

async def process_file(file):
    clog('process_file')
    data = json.dumps({'data':[file]})
    post = {'method':'POST','body':data,'headers': { "Content-Type": "application/json"}}
    response = await pyfetch(API_CLASSIFIER_URL,**post)
    clog('Response:')
    res_json = await response.json()
    responses.append(res_json)
    clog(res_json)
    display_pred_result(file,res_json['data'][0]['confidences'])

def display_pred_result(img,preds):
    result_div = create_element('div')
    img_element = create_element('img')
    img_element.src = img
    result_div.appendChild(img_element)
    result_div.appendChild(break_element())
    for pred in preds:
        result_div.append(f"{pred['label']}: {str(round(pred['confidence']*100,0))}%")
        result_div.appendChild(break_element())
    results_div.appendChild(result_div)

get_element_by_id('python-status').innerHTML = "Python is ready now."
