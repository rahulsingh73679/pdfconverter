var number_next = 0;
var file_count = 0;
var full = false;
var upload_info;
var last_current_file = 0;
var last_step = 0;
var step_begin = null;
var tooltip_activated = true;
var page_numbering_active = false;
var page_numbering_field = null;
var current_pref_element = 0;
var old_browser = false;
var uid = 0;
var sid = 0;
var v = 2;
var publift_only = false;
var download_file_zipped = false;
var separated_conversion = false;
var single_page_conversion = false;
var splitted_conversion = false;
var output_dropdown_set = false;
var ocr_dropdown_set = false;
var dropped_files = new Object();
var frame_load_checker;
var connection_aborted_counter = 0;
var running = false;
var server = '';
var connection_aborted_by_user = false;
var httpTimer = null;
var xmlhttp = createXHR();
var xmlhttpCheck = createXHR();
var xmlhttpLog = createXHR();
var xmlhttpProgress = null;
var getProgressFunc = null;
var pref_tab = 0;
var file_tab = 0;
var preferred_output_format = 'pdf';
var ocr_enabled = false;
var message_box_callback = null;
var last_ad_refresh = (new Date()).getTime();;
var download_link_timer = null;
var upload_retry = 0;
var progress_error = 0;
var connection_timeout = false;
var last_url = '';
var url_change_timer = null;
var show_output_box_always = false;
var ad_check_timer = {};
var adsense_script_error = false;
var adsense_script_loaded = false;
var adsense_enabled = false;
var publift_site_loaded = false;
var publift_ads_blocked = false;
var publift_ads_blocked_counter = 0;
var publift_iframe_loaded = false;
var publift_iframe_error = false;
var ad_mode = 0;
var ce0a_check_status = false;
var conversion_done = false;
var ad_conversion_timer = null;

function createXHR() {
    var xhr;
    if (window.XMLHttpRequest) {
        try {
            xhr = new XMLHttpRequest();
        } catch (e) {}
    } else {
        try {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {}
    }
    return xhr;
}

function check_ext(filename, ext_list) {
    var ext = get_ext(filename);
    var ext_array = ext_list.split(';');
    for (var i = 0; i < ext_array.length; i++) {
        if (ext == ext_array[i]) {
            return true;
        }
    }
    return false;
}

function get_ext(filename) {
    var filename_array = filename.split('.');
    var ext = filename_array[filename_array.length - 1];
    ext = ext.toLowerCase();
    return ext;
}

function get_icon(filename) {
    var filename_array = filename.split('.');
    var ext = filename_array[filename_array.length - 1];
    var img;
    ext = ext.toLowerCase();
    switch (ext) {
        case 'doc':
        case 'docx':
        case 'docm':
        case 'dot':
        case 'dotx':
        case 'dotm':
        case 'wps':
            img = 'word.png';
            break;
        case 'xls':
        case 'xlsx':
        case 'xlsm':
        case 'xlsb':
        case 'xlt':
        case 'xltx':
        case 'xltm':
            img = 'excel.png';
            break;
        case 'ppt':
        case 'pptx':
        case 'pps':
        case 'ppsx':
        case 'pptm':
        case 'ppsm':
        case 'pot':
        case 'potx':
        case 'potm':
            img = 'powerpoint.png';
            break;
        case 'pub':
            img = 'publisher.png';
            break;
        case 'jpg':
        case 'jpeg':
        case 'jpe':
        case 'png':
        case 'gif':
        case 'bmp':
        case 'tif':
        case 'tiff':
        case 'mdi':
        case 'webp':
        case 'psd':
        case 'heic':
        case 'heif':
        case 'jxl':
        case 'jp2':
        case 'jpx':
        case 'jpf':
        case 'j2k':
        case 'j2c':
        case 'jpc':
        case 'dng':
        case 'nef':
        case 'avif':
        case 'emf':
        case 'dcm':
            img = 'image.png';
            break;
        case 'txt':
            img = 'txt.png';
            break;
        case 'odt':
            img = 'odf_write.png';
            break;
        case 'ods':
            img = 'odf_calc.png';
            break;
        case 'odp':
            img = 'odf_impress.png';
            break;
        case 'odg':
            img = 'odf_draw.png';
            break;
        case 'odc':
            img = 'odf_draw.png';
            break;
        case 'odf':
            img = 'odf_math.png';
            break;
        case 'odi':
            img = 'odf_draw.png';
            break;
        case 'odm':
            img = 'odf_write.png';
            break;
        case 'pdf':
            img = 'pdf_format.png';
            break;
        case 'rtf':
            img = 'rtf.png';
            break;
        case 'ps':
            img = 'ps.png';
            break;
        case 'xps':
        case 'oxps':
            img = 'xps.png';
            break;
        case 'epub':
        case 'mobi':
        case 'azw':
        case 'azw3':
        case 'azw4':
            img = 'ebook.png';
            break;
        default:
            img = 'unknown.png';
    }
    return '/images/9.6.0/file_icon/' + img;
}

function edit_file_info(file_box, file_subid, text) {
    var file_id = file_box + '_' + file_subid;
    var edit_info = 'file' + file_id + '_edit_info';
    document.getElementById(edit_info).innerHTML = text;
    if (text == '') {
        edit_file(file_box, file_subid, 0, false);
    } else {
        edit_file(file_box, file_subid, 0, true);
    }
}

function edit_file_info_check(file_box, file_subid) {
    var pagecomposition_used = (document.forms['form1'].elements['userfile_pagecomposition[' + file_box + '][' + file_subid + ']'].value != '');
    var rotation90_used = document.forms['form1'].elements['userfile_rotation90[' + file_box + '][' + file_subid + ']'].value != '';
    var rotation180_used = document.forms['form1'].elements['userfile_rotation180[' + file_box + '][' + file_subid + ']'].value != '';
    var rotation270_used = document.forms['form1'].elements['userfile_rotation270[' + file_box + '][' + file_subid + ']'].value != '';
    var password_used = document.forms['form1'].elements['userfile_password[' + file_box + '][' + file_subid + ']'].value != '';
    var text = '';
    if (pagecomposition_used && (rotation90_used || rotation180_used || rotation270_used)) {
        text += '<div>A user-defined page selection and page rotation was defined for this file.</div>';
    } else {
        if (pagecomposition_used) {
            text += '<div>A user-defined page selection was defined for this file.</div>';
        }
        if (rotation90_used || rotation180_used || rotation270_used) {
            text += '<div>A user-defined page rotation was defined for this file.</div>';
        }
    }
    if (password_used) {
        text += '';
    }
    edit_file_info(file_box, file_subid, text);
}

function edit_file(file_box, file_subid, mode, enable) {
    var file_id = file_box + '_' + file_subid;
    var edit_info = 'file' + file_id + '_edit_info';
    var edit_box_pagecomposition = 'file' + file_id + '_pagecomposition';
    var edit_box_rotation = 'file' + file_id + '_rotation';
    var edit_box_password = 'file' + file_id + '_password';
    var file_info = document.getElementById('file' + file_id + '_info');
    var file_name = document.getElementById('file' + file_id + '_name');
    var edit_box;
    var edit_box_name;
    var edit_box_backgroundColor;
    var edit_box_borderColor;
    var edit_box_color;
    if (mode == 1) {
        edit_box = edit_box_pagecomposition;
        edit_box_name = 'pagecomposition';
        edit_box_backgroundColor = '#EADFDF';
        edit_box_borderColor = '#c95151';
        edit_box_color = '#660000';
        element_hide(edit_box_rotation);
        element_hide(edit_box_password);
        element_hide(edit_info);
    }
    if (mode == 2) {
        edit_box = edit_box_rotation;
        edit_box_name = 'rotation90';
        edit_box_backgroundColor = '#cedae6';
        edit_box_borderColor = '#2b649e';
        edit_box_color = '#42649e';
        element_hide(edit_box_pagecomposition);
        element_hide(edit_box_password);
        element_hide(edit_info);
    }
    if (mode == 3) {
        edit_box = edit_box_password;
        edit_box_name = 'password';
        edit_box_backgroundColor = '#AAAAAA';
        edit_box_borderColor = '#64686c';
        edit_box_color = '#FFFFFF';
        element_hide(edit_box_pagecomposition);
        element_hide(edit_box_rotation);
        element_hide(edit_info);
    }
    if (mode == 0) {
        edit_box = edit_info;
        edit_box_name = '';
        edit_box_backgroundColor = '#CCCCCC';
        edit_box_borderColor = '#AAAAAA';
        edit_box_color = '#000000';
        element_hide(edit_box_pagecomposition);
        element_hide(edit_box_rotation);
        element_hide(edit_box_password);
    }
    if (enable == undefined) {
        enable = document.getElementById(edit_box).style.display != 'block';
    }
    if (!enable) {
        element_hide(edit_box);
        file_info.style.border = '0px solid #000000';
        file_info.style.backgroundColor = '';
        file_info.style.marginBottom = '0px';
        file_name.style.color = '#222222';
        file_name.style.fontWeight = 'normal';
        if (mode != 0) {
            edit_file_info_check(file_box, file_subid);
        }
    } else {
        element_fadein(edit_box);
        file_name.style.color = edit_box_color;
        file_name.style.fontWeight = 'bold';
        file_info.style.border = '1px solid ' + edit_box_borderColor;
        file_info.style.marginBottom = '5px';
        file_info.style.backgroundColor = edit_box_backgroundColor;
        if (edit_box_name != '') {
            document.forms['form1'].elements['userfile_' + edit_box_name + '[' + file_box + '][' + file_subid + ']'].focus();
        }
    }
}

function pagelist_check(input, element_id, type) {
    var pagelist_check = document.getElementById(element_id);
    if (input.value.replace(/ /g, '') == '') {
        input.style.border = '2px solid #999999';
        pagelist_check.style.display = 'none';
    } else {
        if (type != undefined && type == 'pagecomposition') {
            if (input.value.match(/^\s*(\d+|\d+\s*-\s*\d*)(\s*[,;\|\/]\s*(\d+|\d+\s*-\s*\d*))*\s*[,;\|\/]?\s*$/)) {
                pagelist_check.style.display = 'none';
                input.style.border = '2px solid #00AA00';
            } else {
                pagelist_check.style.display = 'block';
                input.style.border = '2px solid #FF0000';
            }
        } else {
            if (input.value.match(/^\s*(\d+|\d+\s*-\s*\d*)(\s*[,;]\s*(\d+|\d+\s*-\s*\d*))*\s*[,;]?\s*$/)) {
                pagelist_check.style.display = 'none';
                input.style.border = '2px solid #00AA00';
            } else {
                pagelist_check.style.display = 'block';
                input.style.border = '2px solid #FF0000';
            }
        }
    }
    activate_features();
}

function split_button_check(input, file_id) {
    var split_button = document.getElementById('file' + file_id + '_pagecomposition_pagelist_split');
    if (document.forms[0].elements['output_format'].value != 'pdf') {
        split_button.style.display = 'none';
    } else if (input.value.match(/[-\|/,]\s*$/) || input.value.match(/^\s*$/) || input.value.match(/^\s*(\d+|\d+\s*-\s*\d*)(\s*[,;\|\/]\s*(\d+|\d+\s*-\s*\d*))*\s*[,;\|\/]?\s*$/) == null) {
        split_button.style.display = 'none';
    } else {
        split_button.style.display = 'block';
    }
}

function add_split_operator(file_box, i, file_id) {
    var input = document.forms['form1'].elements['userfile_pagecomposition[' + file_box + '][' + i + ']'];
    var res = input.value.match(/(\d+)\s*$/);
    if (res[1] != undefined) {
        input.value = input.value + ' | ' + (parseInt(res[1]) + 1) + '-';
    } else {
        input.value = input.value + ' | ';
    }
    var split_button = document.getElementById('file' + file_id + '_pagecomposition_pagelist_split');
    split_button.style.display = 'none';
    input.focus();
    activate_features();
}

function rotate_all(file_box, i, degree) {
    var rotation90 = document.forms['form1'].elements['userfile_rotation90[' + file_box + '][' + i + ']'];
    var rotation180 = document.forms['form1'].elements['userfile_rotation180[' + file_box + '][' + i + ']'];
    var rotation270 = document.forms['form1'].elements['userfile_rotation270[' + file_box + '][' + i + ']'];
    if (degree == 90) {
        rotation90.value = '1-';
        rotation180.value = '';
        rotation270.value = '';
    }
    if (degree == 180) {
        rotation90.value = '';
        rotation180.value = '1-';
        rotation270.value = '';
    }
    if (degree == 270) {
        rotation90.value = '';
        rotation180.value = '';
        rotation270.value = '1-';
    }
    pagelist_check(rotation90, 'file' + file_box + '_' + i + '_rotation90_pagelist_check');
    pagelist_check(rotation180, 'file' + file_box + '_' + i + '_rotation180_pagelist_check');
    pagelist_check(rotation270, 'file' + file_box + '_' + i + '_rotation270_pagelist_check');
}

function highlight_group(file_group, status) {
    var color;
    var file_box_name = 'div_file_box' + file_group + '_';
    if (status == true) {
        color = '#fffcf5';
    } else {
        color = '';
    }
    var nodes = document.getElementById('files').childNodes;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType == 1 && nodes[i].getAttribute('id') != null) {
            if (nodes[i].getAttribute('id').substr(0, file_box_name.length) == file_box_name) {
                nodes[i].style.backgroundColor = color;
            }
        }
    }
}

function count_group(file_group) {
    var file_box_name = 'div_file_box' + file_group + '_';
    var nodes = document.getElementById('files').childNodes;
    var count = 0;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType == 1 && nodes[i].getAttribute('id') != null) {
            if (nodes[i].getAttribute('id').substr(0, file_box_name.length) == file_box_name) {
                count++;
            }
        }
    }
    return count;
}

function highlight(file_id, status) {
    var color;
    var file_box_name = 'div_file_box' + file_id;
    if (status == true) {
        color = '#fffcf5';
    } else {
        color = '';
    }
    document.getElementById(file_box_name).style.backgroundColor = color;
}

function get_current_filesize() {
    var inputfields = document.getElementsByTagName('input');
    var size = 0;
    for (var i = 0; i < inputfields.length; i++) {
        if (inputfields[i].getAttribute('type') == 'file') {
            if (inputfields[i].files) {
                var files = inputfields[i].files;
                for (var j = 0; j < files.length; j++) {
                    if (files[j].size != undefined) {
                        size += files[j].size;
                    }
                }
            }
        }
    }
    for (var key in dropped_files) {
        for (var i = 0; i < dropped_files[key].length; i++) {
            if (dropped_files[key][i].size != undefined) {
                size += dropped_files[key][i].size;
            }
        }
    }
    return size;
}

function get_tooltip_change(file_box) {
    var count_group_files = count_group(file_box);
    var text = '';
    if (count_group_files > 1) {
        text = count_group_files + ' files to change';
    } else {
        text = 'Change file selection';
    }
    return text;
}

function get_tooltip_delete(file_box) {
    var count_group_files = count_group(file_box);
    var text = '';
    if (count_group_files > 1) {
        text = count_group_files + ' files to delete';
    } else {
        text = 'Remove file selection';
    }
    return text;
}

function add_file(file_number, files_object) {
    if (pref_tab > 0) {
        if (current_pref_element != pref_tab) {
            preferences_element_activate(pref_tab);
        }
        pref_tab = 0;
    }
    tooltip(null, null);
    var error_msg = null;
    var file_box = file_number - 1;
    if (file_number > 0) {
        init_windows();
        var files;
        var html_value = '';
        var file_box_name = 'div_file_box' + file_box + '_';
        var startNode = null;
        var nodes = document.getElementById('files').childNodes;
        var elements = new Array();
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeType == 1 && nodes[i].getAttribute('id') != null) {
                if (nodes[i].getAttribute('id').substr(0, file_box_name.length) == file_box_name) {
                    elements.push(nodes[i]);
                } else if (full == false && i == (nodes.length - 1)) {
                    elements.push(nodes[i]);
                    var node_input = document.getElementById('files_input');
                    node_input.removeChild(node_input.lastChild);
                }
            }
        }
        for (var i = 0; i < elements.length; i++) {
            if (i == 0) {
                startNode = elements[i].previousSibling;
            }
            document.getElementById('files').removeChild(elements[i]);
            file_count--;
        }
        if (startNode == null) {
            startNode = document.getElementById('files').firstChild;
        } else {
            startNode = startNode.nextSibling;
        }
        delete dropped_files['userfile[' + (file_number - 1) + ']'];
        if (files_object) {
            if (file_count >= 20) {
                error_msg = 'Warning: You can only select up to 20 files.';
                display_message(error_msg);
                return;
            }
            files = files_object;
            dropped_files['userfile[' + (file_number - 1) + ']'] = files;
        } else if (document.forms['form1'].elements['userfile[' + file_box + '][]'].files == undefined) {
            files = new Array();
            files[0] = new Object();
            files[0]['name'] = document.forms['form1'].elements['userfile[' + file_box + '][]'].value;
            files[0]['size'] = 0;
        } else {
            files = document.forms['form1'].elements['userfile[' + file_box + '][]'].files;
        }
        for (var i = 0; i < files.length; i++) {
            var file_id = file_box + '_' + i;
            var filename = files[i].name;
            var file_error = '';
            var file_extra = '';
            var file_icon = '';
            var file_tab_valid = false;
            if (filename == undefined) {
                filename = files[i].fileName;
            }
            if (file_count >= 20) {
                error_msg = 'Warning: You can only select up to 20 files.';
                break;
            }
            if ((get_current_filesize()) > 157286400) {
                error_msg = '<div style="line-height: 1.5em">The amount of data is too large! (' + (Math.round(get_current_filesize() / 1024 / 1024 * 100) / 100) + ' MB)<br>You are only allowed to upload a maximum of 150 MB in total.</div>';
                break;
            }
            file_count++;
            var file_extra_count = 0;
            if (files[i].size != undefined && files[i].size > 104857600) {
                file_error = 'The file is too large! ' + '(' + (Math.round(files[i].size / 1024 / 1024 * 100) / 100) + ' MB) The maximum file size is 100 MB.';
            }
            if (check_ext(filename, 'zip;rar;tar;7z;bz2;gz') == true) {
                file_error = 'Archives are not supported. Please unpack your archive before conversion!';
            } else if (check_ext(filename, 'html;htm;msg;rpt;pages;csv;pmd;dwg;do;xml;php;c;cpp;java;aspx;one;inp;mht;dwfx;cdr;url;prn;ai;eps;eml;p7s;p7m;p65;mpp;svg;djvu;sdoc;jfif;tn3;opf;webarchive;pdg;vsd;vsdx;log;opd;abw;xcf;ott;bpm;jsp;xlr;mdl;indd;tex') == true) {
                var file_extension = get_ext(filename);
                file_error = 'This file must be saved as XPS file before the conversion: <a href="/' + file_extension + '2pdf">see instructions</a>';
            } else if (check_ext(filename, 'doc;jpg;jpeg;jpe;png;txt;xls;gif;pps;ppt;pub;pdf;bmp;tif;tiff;docx;xlsx;ppsx;pptx;docm;dot;dotx;dotm;xlsm;xlsb;xlt;xltx;xltm;pptm;ppsm;pot;potx;potm;wps;rtf;odt;ods;odp;odg;odc;odf;odi;odm;xps;oxps;ps;mdi;epub;mobi;azw;azw3;azw4;webp;psd;heic;heif;jxl;jp2;jpx;jpf;j2k;j2c;jpc;dng;nef;avif;emf;dcm') == false) {
                file_error = 'Unknown file extension! This file type is not supported yet.';
                sendLog(get_ext(filename), 'unknown_file_extension');
            } else {
                if (check_ext(filename, 'pdf') == true && ppa_supported()) {
                    if (file_tab == 4) {
                        file_tab_valid = true;
                    }
                    file_extra += '<button type="button" class="button_ppa" onclick="ppa_load(' + file_box + ', ' + i + ', \'standard\')" onmouseover="tooltip(\'Wizard for selecting, reordering and rotating pages (with live preview)\', this)" onmouseout="tooltip(null, this)"><img src="/images/9.6.0/button_ppa.png" alt="" style="width: 56px; height: 25px"></button>';
                    file_extra_count++;
                }
                if (check_ext(filename, 'pdf') == true) {
                    if (file_tab == 3) {
                        file_tab_valid = true;
                    }
                    file_extra += '<button type="button" class="button_password" onclick="edit_file(' + file_box + ', ' + i + ', 3)" onmouseover="tooltip(\'PDF read protected? Enter the required password here\', this)" onmouseout="tooltip(null, this)"><img src="/images/9.6.0/button_password.png" alt="" style="width: 56px; height: 25px"></button>';
                    file_extra_count++;
                }
                if (check_ext(filename, 'pdf;oxps;xps;ps;tif;tiff;mdi;dcm') == true) {
                    if (file_tab == 2) {
                        file_tab_valid = true;
                    }
                    file_extra += '<button type="button" class="button_rotation" onclick="edit_file(' + file_box + ', ' + i + ', 2)" onmouseover="tooltip(\'Rotate pages\', this)" onmouseout="tooltip(null, this)"><img src="/images/9.6.0/button_rotation.png" alt="" style="width: 56px; height: 25px"></button>';
                    file_extra_count++;
                }
                if (check_ext(filename, 'doc;xls;pps;ppt;pub;pdf;docx;xlsx;ppsx;pptx;docm;dot;dotx;dotm;xlsm;xlsb;xlt;xltx;xltm;pptm;ppsm;pot;potx;potm;wps;odt;ods;odp;odm;oxps;xps;ps;tif;tiff;mdi;dcm') == true) {
                    if (file_tab == 1) {
                        file_tab_valid = true;
                    }
                    file_extra += '<button type="button" class="button_pagecomposition" onclick="edit_file(' + file_box + ', ' + i + ', 1)" onmouseover="tooltip(\'Select pages, rearrange pages or split the file\', this)" onmouseout="tooltip(null, this)"><img src="/images/9.6.0/button_pagecomposition.png" alt="" style="width: 56px; height: 25px"></button>';
                    file_extra_count++;
                }
            }
            var filename_split;
            filename_split = filename.split('\\');
            if (filename_split.length > 1) {
                filename = filename_split[(filename_split.length - 1)];
            } else {
                filename_split = filename.split('/');
                filename_split = filename_split[(filename_split.length - 1)];
            }
            var filename_new = '';
            for (var j = 0; j < filename.length; j++) {
                filename_new += filename.charAt(j) + '<wbr>';
            }
            file_icon = '<img src=\'' + get_icon(filename) + '\' class=\'file_icon\' alt=\'\'>';
            if (file_error.length > 0) {
                file_error = '<div id="div_file' + file_id + '_error" class="div_file_error"><table><tr><td style="vertical-align: middle; padding: 0px 12px 0px 5px"><img src="/images/9.6.0/alert.png" style="width: 25px"></td><td style="vertical-align: middle;">' + file_error + '</td></tr></table></div>';
            }
            html_value = '<div class="file_element selected_file" onmouseover="highlight(\'' + file_id + '\', true)" onmouseout="highlight(\'' + file_id + '\', false)"><div style="float: left;" class="file_element_left"><table class="file_element_left_table"><tr><td class="td_file_title cursor_pointer non_mobile" onmousedown="start_motion(\'' + file_id + '\'); return false;"><b>File <span id="file_counter' + file_id + '"></span>:</b></td><td class="td_file_input non_mobile"><button type="button" onclick="input_file_click(' + file_box + ')" onmouseover="show_input_field(this, ' + file_box + ', true, \'change_button_hover\', \'change_button\'); highlight_group(\'' + file_box + '\', true); tooltip(get_tooltip_change(\'' + file_box + '\'), this);" onmouseout="highlight_group(\'' + file_box + '\', false); tooltip(null, this);" class="change_button">Change...</button><button type="button" style="cursor: pointer; margin-top: 7px; padding: 0px; border: none; background: none" onclick="delete_file(\'' + file_box + '\');" onmouseover="highlight_group(\'' + file_box + '\', true); tooltip(get_tooltip_delete(\'' + file_box + '\'), this);" onmouseout="highlight_group(\'' + file_box + '\', false); tooltip(null, this);"><img src="/images/9.6.0/button_delete.png" alt=""></button></td></tr></table></div><div style="overflow: hidden; min-width: 200px"><table style="width: 100%"><tr><td class="td_file_info"><div id="file' + file_id + '_info" style="border-radius: 5px;"><div style="float: left"><table class="table_info"><tr><td class="td_file_icon cursor_pointer" onmousedown="start_motion(\'' + file_id + '\'); return false;" onmouseover="tooltip(\'Files can be rearranged by Drag&Drop\', null)" onmouseout="tooltip(null, this)">' + file_icon + '</td><td id="file' + file_id + '_name" class="td_file_name cursor_pointer" onmousedown="start_motion(\'' + file_id + '\'); return false;" onmouseover="tooltip(\'Files can be rearranged by Drag&Drop\', null)" onmouseout="tooltip(null, this)">' + filename_new + '</td><td class="td_file_delete_mobile"><img src="/images/9.6.0/button_delete.png" alt="" onclick="delete_file(\'' + file_box + '\');" onmouseover="highlight_group(\'' + file_box + '\', true); tooltip(get_tooltip_delete(\'' + file_box + '\'), this); this.src=\'/images/9.6.0/button_delete_hover.png\'" onmouseout="highlight_group(\'' + file_box + '\', false); tooltip(null, this); this.src=\'/images/9.6.0/button_delete.png\'" style="cursor: pointer"></td></tr></table></div><div style="overflow: hidden; min-width: ' + (68 * file_extra_count + 12) + 'px; text-align: right"><table style="width: 100%"><tr><td class="cursor_pointer" onmousedown="start_motion(\'' + file_id + '\'); return false;" onmouseover="tooltip(\'Files can be rearranged by Drag&Drop\', null)" onmouseout="tooltip(null, this)"></td><td style="padding: 6px; width: ' + (68 * file_extra_count) + 'px; text-align: right">' + file_extra + '</td></tr></table></div><div id="file' + file_id + '_pagecomposition" class="file_edit"><div style="margin-bottom: 10px"><div style="margin-bottom: 4px" class="pagecomposition_info">In case you need only specific pages in this document or you want to change the page order or split the file into several parts, then you can define this in the text field below. If the field remains empty, all pages will be selected automatically.</div><div style="float: left; margin-right: 10px"><div style="margin: 12px 0px 0px 0px"><b>select following pages (exactly in this order):</b></div></div><div style="float: left"><div style="float: left;"><input type="text" name="userfile_pagecomposition[' + file_box + '][' + i + ']" class="input_pagecomposition" onkeyup="pagelist_check(this, \'file' + file_id + '_pagecomposition_pagelist_check\', \'pagecomposition\'); split_button_check(this, \'' + file_id + '\')" maxlength="3000"><div class="pagelist_check" id="file' + file_id + '_pagecomposition_pagelist_check">Input is invalid.</div></div>';
            if (check_ext(filename, 'pdf') == true && ppa_supported()) {
                html_value += '<div style="float: left; margin-top: 5px"><button type="button" class="button_ppa" onclick="ppa_load(' + file_box + ', ' + i + ', \'standard\')" onmouseover="tooltip(\'Wizard for page selection with preview\', this)" onmouseout="tooltip(null, this)"><img src="/images/9.6.0/button_small_ppa.png" alt="Page wizard"></button></div>';
            }
            html_value += '<div style="float: left; margin-top: 5px; display: none" id="file' + file_id + '_pagecomposition_pagelist_split"><button type="button" class="button_split" onclick="add_split_operator(' + file_box + ', ' + i + ', \'' + file_id + '\')" onmouseover="tooltip(\'Split file (optional)\', this)" onmouseout="tooltip(null, this)"><img src="/images/9.6.0/button_small_split.png" alt="Split file (optional)"></button></div><div style="clear: left"></div></div><div style="clear: left"></div></div><div style="float: left; margin: 0px 15px 15px 0px"><ul class="pagecomposition_help"><li>Specific pages by using comma: <b>1, 2, 3</b></li><li>Page range by using hyphen: <b>1-3</b></li><li>Split file by using vertical line: <span style="white-space: nowrap;"><b>1-3 | 4-6</b></span></li></ul></div><div style="float: left"><div style="float: left; margin-right: 10px"><b>e.g. </b></div><div style="float: left; "><ul class="pagecomposition_help"><table class="pagecomposition_examples"><tr><td style="white-space: nowrap;"><li>2-9, 1</li></td><td></td></tr><tr><td style="white-space: nowrap;"><li>3-</li></td><td>(all pages starting from 3)</td></tr><tr><td style="white-space: nowrap;"><li>8-1</li></td><td>(reverse pages from 8 to 1)</td></tr><tr><td style="white-space: nowrap; padding-right: 10px"><li>1-3 | 4-5</li></td><td>(split file between 3 and 4)</td></tr></table></ul><div style="margin-top: 5px"><a href="/features#pagecomposition" target="_blank"><img src="/images/9.6.0/help.png" alt="help" style="padding: 0px 5px 0px 0px">More examples</a></div></div><div style="clear: left"></div></div><div style="clear: left"></div></div><div id="file' + file_id + '_rotation" class="file_edit"><div style="margin-bottom: 10px">If you want to rotate single pages or even page ranges, then you can define them in the text fields below.</div><div style="float: left; margin-right: 20px"><div style="margin-top: 5px"><div style="float: left; padding-right: 5px;" class="non_mobile"><img src="/images/9.6.0/rotation_90.png" alt=""></div><div style="float: left;"><b>rotate following pages to the right: </b><div style="margin-top: 3px"><div style="float: left;"><input type="text" name="userfile_rotation90[' + file_box + '][' + i + ']" class="input_rotation" onkeyup="pagelist_check(this, \'file' + file_id + '_rotation90_pagelist_check\')" maxlength="3000"><input type="button" class="button_rotate_all" value="All" onclick="rotate_all(' + file_box + ', ' + i + ', 90)"><div class="pagelist_check" id="file' + file_id + '_rotation90_pagelist_check">Input is invalid.</div></div>';
            if (check_ext(filename, 'pdf') == true && ppa_supported()) {
                html_value += '<div style="float: left"><button type="button" class="button_ppa" onclick="ppa_load(' + file_box + ', ' + i + ', \'rotation90\')" onmouseover="tooltip(\'Wizard for page selection with preview\', this)" onmouseout="tooltip(null, this)"><img src="/images/9.6.0/button_small_ppa.png" alt="Page wizard"></button></div>';
            }
            html_value += '<div style="clear: left"></div></div></div><div style="clear: left"></div></div><div style="margin-top: 10px"><div style="float: left; padding-right: 5px;" class="non_mobile"><img src="/images/9.6.0/rotation_180.png" alt=""></div><div style="float: left;"><b>turn the following pages upside down: </b><div style="margin-top: 3px"><div style="float: left;"><input type="text" name="userfile_rotation180[' + file_box + '][' + i + ']" class="input_rotation" onkeyup="pagelist_check(this, \'file' + file_id + '_rotation180_pagelist_check\')" maxlength="3000"><input type="button" class="button_rotate_all" value="All" onclick="rotate_all(' + file_box + ', ' + i + ', 180)"><div class="pagelist_check" id="file' + file_id + '_rotation180_pagelist_check">Input is invalid.</div></div>';
            if (check_ext(filename, 'pdf') == true && ppa_supported()) {
                html_value += '<div style="float: left"><button type="button" class="button_ppa" onclick="ppa_load(' + file_box + ', ' + i + ', \'rotation180\')" onmouseover="tooltip(\'Wizard for page selection with preview\', this)" onmouseout="tooltip(null, this)"><img src="/images/9.6.0/button_small_ppa.png" alt="Page wizard"></button></div>';
            }
            html_value += '<div style="clear: left"></div></div></div><div style="clear: left"></div></div><div style="margin-top: 10px; margin-bottom: 15px"><div style="float: left; padding-right: 5px;" class="non_mobile"><img src="/images/9.6.0/rotation_270.png" alt=""></div><div style="float: left;"><b>rotate following pages to the left: </b><div style="margin-top: 3px"><div style="float: left;"><input type="text" name="userfile_rotation270[' + file_box + '][' + i + ']" class="input_rotation" onkeyup="pagelist_check(this, \'file' + file_id + '_rotation270_pagelist_check\')" maxlength="3000"><input type="button" class="button_rotate_all" value="All" onclick="rotate_all(' + file_box + ', ' + i + ', 270)"><div class="pagelist_check" id="file' + file_id + '_rotation270_pagelist_check">Input is invalid.</div></div>';
            if (check_ext(filename, 'pdf') == true && ppa_supported()) {
                html_value += '<div style="float: left"><button type="button" class="button_ppa" onclick="ppa_load(' + file_box + ', ' + i + ', \'rotation270\')" onmouseover="tooltip(\'Wizard for page selection with preview\', this)" onmouseout="tooltip(null, this)"><img src="/images/9.6.0/button_small_ppa.png" alt="Page wizard"></button></div>';
            }
            html_value += '<div style="clear: left"></div></div></div><div style="clear: left"></div></div></div><div style="float: left; margin-top: 5px;"><div style="border: 1px solid #a0bfe3; padding: 10px 10px; background-color: #e5ecf4"><div style="float: left; margin-right: 10px" class="non_mobile"><img src="/images/9.6.0/info.png" style="width: 30px" alt=""></div><div style="float: left;">Specific pages by using comma: <b>1, 2, 3</b><br>Page range by using hyphen: <b>1-3</b><div style="margin-top: 10px; margin-bottom: 10px"><b>Example:</b><br>1- <span style="padding-left: 20px">(all pages will be rotated)</span><br>1-5, 8, 9<br></div><div style="float: left"><a href="/features#rotation" target="_blank"><img src="/images/9.6.0/help.png" alt="help" style="border: 0px solid #000000; padding: 0px"></a></div><div style="float: left; margin-left: 5px"><a href="/features#rotation" target="_blank">More examples</a></div><div style="clear: left"></div></div><div style="clear: left"></div></div></div><div style="clear: left; font-size: 1px">&nbsp;</div></div><div id="file' + file_id + '_password" class="file_edit"><div style="margin-bottom: 10px">In case the PDF file is read-protected and needs a password for opening, then please enter this password here.</div><span style="margin-right: 10px; display: inline-block; margin-bottom: 5px; vertical-align: middle"><b>Required password for opening the PDF file: </b></span><input type="password" name="userfile_password[' + file_box + '][' + i + ']" class="input_password" maxlength="200" style="display: inline-block; margin-bottom: 5px; vertical-align: middle"></div><div id="file' + file_id + '_edit_info" class="file_edit" style="color: #333333; font-size: 14px;"></div>' + file_error + '</div></td></tr></table></div><div style="clear: both"></div></div>';
            node = document.createElement('div');
            node.setAttribute('id', 'div_file_box' + file_box + '_' + i);
            node.className = 'file_box';
            node.innerHTML = html_value;
            document.getElementById('files').insertBefore(node, startNode);
            if (file_tab > 0 && file_tab_valid) {
                edit_file(file_box, i, file_tab);
                file_tab = 0;
            }
        }
    }
    hide_input_fields();
    add_file_inputfield();
    renumber();
    if (error_msg != null) {
        delete_file(file_box);
        display_message(error_msg);
    }
    refresh_ads();
}

function add_file_inputfield() {
    var file_id = number_next;
    var html_value = '';
    if (file_count == 0) {
        html5_text = '';
        dragdrop_text = '';
        if (html5_support()) {
            html5_text = '<div class="multiple_files_text"><b>Tip:</b> you can select several files at once (by pressing the Ctrl-Key)</div>';
            dragdrop_text = '<div class="dragdrop_text">(or just drag&drop your files here)</div>';
        }
        html_value = '<div class="file_element" style="margin: 7px"><div class="upload_box"><table class="vertical_middle"><tr><td><div style="text-align: center"><button type="button" onclick="input_file_click(' + file_id + ')" onmouseover="show_input_field(this, ' + file_id + ', false, \'browse_button_hover\', \'browse_button\');" class="browse_button">Select files</button></div><div>' + dragdrop_text + '</div></td></tr></table></div><div class="upload_info"><table class="vertical_middle" style="width: auto; margin: 0px auto"><tr><td>The maximum file size is <b>100 MB</b>. All files together must not exceed <b>150 MB</b>.<br>You can select up to 20 files.' + html5_text + '</td></tr></table></div><div style="clear: left"></div></div>';
    } else if (file_count < 20) {
        html_value = '<div class="file_element"><table class="table_file"><tr><td class="td_file_title non_mobile"><b>File <span id="file_counter' + file_id + '"></span>:</b> (optional)</td><td class="td_file_input" style="width: auto"><button type="button" onclick="input_file_click(' + file_id + ')" onmouseover="show_input_field(this, ' + file_id + ', false, \'browse_button_small_hover\', \'browse_button_small\');" class="browse_button_small">Browse...</button></td><td></td></tr></table></div>';
    } else {
        full = true;
    }
    if (html_value != '') {
        number_next++;
        full = false;
        var node;
        node = document.createElement('div');
        node.setAttribute('id', 'div_file_box' + file_id);
        node.className = 'input_field';
        node.innerHTML = '<input name="userfile[' + file_id + '][]" id="input_file' + file_id + '" type="file" onChange="add_file(' + number_next + ')" multiple="multiple">';
        document.getElementById('files_input').appendChild(node);
        node = document.createElement('div');
        node.setAttribute('id', 'div_file_box' + file_id + '_0');
        node.innerHTML = html_value;
        document.getElementById('files').appendChild(node);
        file_count++;
    }
}

function input_file_click(id) {
    var input = document.getElementById('input_file' + id);
    if (input) {
        input.click();
    }
}

function delete_file(file_box) {
    delete dropped_files['userfile[' + file_box + ']'];
    tooltip(null, null);
    var file_box_name = 'div_file_box' + file_box + '_';
    var nodes = document.getElementById('files').childNodes;
    var node_files = document.getElementById('files');
    var node_input = document.getElementById('files_input');
    var elements = new Array();
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType == 1 && nodes[i].getAttribute('id') != null) {
            if (nodes[i].getAttribute('id').substr(0, file_box_name.length) == file_box_name) {
                elements.push(nodes[i]);
            }
        }
    }
    for (var i = 0; i < elements.length; i++) {
        node_files.removeChild(elements[i]);
        file_count--;
        if (full == true) {
            add_file_inputfield();
        }
    }
    var file_input = document.getElementById('div_file_box' + file_box);
    node_input.removeChild(file_input);
    renumber();
    if (node_input.childNodes.length == 1) {
        node_files.removeChild(node_files.firstChild);
        node_input.removeChild(node_input.firstChild);
        number_next = 0;
        file_count = 0;
        add_file(0);
    }
}

function delete_all_files() {
    dropped_files = new Object();
    tooltip(null, null);
    var node_files = document.getElementById('files');
    var node_input = document.getElementById('files_input');
    while (node_files.firstChild) {
        node_files.removeChild(node_files.firstChild);
    }
    while (node_input.firstChild) {
        node_input.removeChild(node_input.firstChild);
    }
    number_next = 0;
    file_count = 0;
    add_file(0);
}

function renumber() {
    var file_counter_elements = document.getElementsByTagName('span');
    var counter = 1;
    for (var i = 0; i < file_counter_elements.length; i++) {
        if (file_counter_elements[i].id.substr(0, 12) == 'file_counter') {
            file_counter_elements[i].innerHTML = counter;
            counter++;
        }
    }
    activate_features();
}

function getFileNumber() {
    return file_count - 1;
}

function files_splitted() {
    var main;
    if (parent != undefined) {
        main = parent.document;
    } else {
        main = document;
    }
    var file_splitting = false;
    var form_fields = main.forms[0].elements;
    for (var i = 0; i < form_fields.length; i++) {
        if (main.forms[0].elements[i].name.search('userfile_pagecomposition') != -1) {
            if (main.forms[0].elements[i].value.match(/(\d|-)\s*[\|\/]\s*\d+/)) {
                file_splitting = true;
            }
        }
    }
    return file_splitting;
}

function activate_features() {
    var nodes = document.getElementById('files_input').childNodes;
    var only_pdf_xps_images = true;
    var xps_included = false;
    var only_pdf = true;
    var excel_included = false;
    var images_included = false;
    var non_images_included = false;
    var mixed_merge = true;
    download_file_zipped = false;
    separated_conversion = false;
    single_page_conversion = false;
    splitted_conversion = files_splitted();
    var file_list = new Array();
    var conversion_box = document.getElementById('conversion_box');
    var output_format_box = document.getElementById('output_format_box');
    var output_format_outer_box = document.getElementById('output_format_outer_box');
    var output_format_inner_box = document.getElementById('output_format_inner_box');
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType == 1) {
            var file_node = nodes[i].firstChild;
            if (file_node.files == undefined) {
                if (file_node.value != undefined && file_node.value != '') {
                    file_list.push(file_node.value);
                }
            } else {
                for (var j = 0; j < file_node.files.length; j++) {
                    var filename = file_node.files[j].name;
                    if (filename == undefined) {
                        filename = file_node.files[j].fileName;
                    }
                    file_list.push(filename);
                }
            }
        }
    }
    for (var key in dropped_files) {
        for (var i = 0; i < dropped_files[key].length; i++) {
            var filename = dropped_files[key][i].name;
            if (filename == undefined) {
                filename = dropped_files[key][i].fileName;
            }
            file_list.push(filename);
        }
    }
    var image_formats = 'jpg;jpeg;jpe;gif;png;tif;tiff;bmp;mdi;webp;psd;heic;heif;jxl;jp2;jpx;jpf;j2k;j2c;jpc;dng;nef;avif;emf;dcm';
    for (var i = 0; i < file_list.length; i++) {
        var filename = file_list[i];
        if (check_ext(filename, 'pdf;xps;oxps;' + image_formats) == false) {
            only_pdf_xps_images = false;
        }
        if (check_ext(filename, 'xps;oxps') == true) {
            xps_included = true;
        }
        if (check_ext(filename, 'pdf;xps;oxps;tif;tiff;mdi') == false) {
            mixed_merge = false;
        }
        if (check_ext(filename, 'pdf') == false) {
            only_pdf = false;
        }
        if (check_ext(filename, 'xls;xlsx;xlsm;xlsb;xlt;xltx;xltm') == true) {
            excel_included = true;
        }
        if (check_ext(filename, image_formats) == true) {
            images_included = true;
        } else {
            non_images_included = true;
        }
    }
    var output_format = document.forms[0].elements['output_format'].value;
    var pdf_advanced_ocr_language_box = document.getElementById('pdf_advanced_ocr_language_box');
    var pdf_advanced_ocr_language = document.forms[0].elements['pdf_advanced_ocr_language'].value;
    var export_ocr_box = document.getElementById('export_ocr_box');
    var export_ocr = document.forms[0].elements['export_ocr'].value == 'yes';
    var export_ocr_language_box = document.getElementById('export_ocr_language_box');
    var export_ocr_language = document.forms[0].elements['export_ocr_language'].value;
    var export_fullocr_box = document.getElementById('export_fullocr_box');
    var export_image_box = document.getElementById('export_image_box');
    var export_fullocr = document.forms[0].elements['export_fullocr'].checked;
    var export_image = document.forms[0].elements['export_image'].checked;
    var conversion_info = document.getElementById('conversion_info');
    var convert_to_box = document.getElementById('convert_to_box');
    var export_box = document.getElementById('export_box');
    var conversion_mode_box = document.getElementById('conversion_mode_box');
    var conversion_mode = document.getElementById('conversion_mode').value;
    var merge_mode_box = document.getElementById('merge_mode_box');
    var conversion_mode_info = document.getElementById('conversion_mode_info');
    var merge_info = document.getElementById('merge_mode_info');
    var conversion_mode_info_box = document.getElementById('conversion_mode_info_box');
    var splitting_info = document.getElementById('splitting_info');
    var export_title = document.getElementById('export_title');
    var convert_to_title = document.getElementById('convert_to_title');
    var pdf_advanced_ocr_language_title = document.getElementById('pdf_advanced_ocr_language_title');
    convert_to_title.style.color = '#000000';
    pdf_advanced_ocr_language_title.style.color = '#000000';
    var conversion_info_array = [];
    conversion_box.style.display = 'block';
    export_ocr_box.style.display = 'inline-block';
    var display = {};
    display['convert_to_box'] = 'none';
    display['conversion_mode_box'] = 'none';
    display['merge_mode_box'] = 'none';
    display['export_box'] = 'none';
    display['export_ocr_language_box'] = 'none';
    display['export_fullocr_box'] = 'none';
    display['pdf_advanced_ocr_language_box'] = 'none';
    display['export_image_box'] = 'none';
    display['conversion_info'] = 'none';
    reset_display_options(display);
    splitting_info.style.display = 'none';
    output_format_outer_box.style.display = 'block';
    output_format_inner_box.style.display = 'inline-block';
    merge_info.style.display = 'none';
    conversion_mode_info_box.style.display = 'none';
    var merge_mode = document.forms[0].elements['merge_mode'].value;
    output_format_box.disabled = false;
    var mixed_merge_selected = false;
    if (getFileNumber() == 2 && conversion_mode == 'merge' && mixed_merge == true && merge_mode == 'mixed') {
        mixed_merge_selected = true;
    }
    if (getFileNumber() >= 1) {
        var output_format_options = '<select name="output_format" onchange="output_format_change(this)" class="form_field_margin">';
        if (only_pdf) {
            output_format_options += '<option value="pdf" style="font-weight: bold" customSelectBoxFontWeight="bold" customSelectBoxIcon="/images/9.6.0/file_icon/pdf_format.png">PDF (file format is retained)</option>';
        } else {
            output_format_options += '<option value="pdf" style="font-weight: bold" customSelectBoxFontWeight="bold" customSelectBoxIcon="/images/9.6.0/file_icon/pdf_format.png">PDF file (*.pdf)</option>';
        }
        if (splitted_conversion == false && mixed_merge_selected == false) {
            if (only_pdf_xps_images) {
                output_format_options += '<option value="pdf_searchable" customSelectBoxIcon="/images/9.6.0/file_icon/pdf_format.png">Searchable PDF (only for scans)</option>';
            }
            output_format_options += '<option value="pdf_image" customSelectBoxIcon="/images/9.6.0/file_icon/pdf_format.png">Image-PDF (each page is an image)</option><option value="pdf_single_page" customSelectBoxIcon="/images/9.6.0/file_icon/pdf_format.png">Each page as separate PDF file</option>';
            output_format_options += '<option value="pdf" disabled="disabled">---</option><option value="docx" style="font-weight: bold; color: #0b3ea8" customSelectBoxFontWeight="bold" customSelectBoxColor="#0b3ea8" customSelectBoxIcon="/images/9.6.0/file_icon/word.png">Word 2007-2021 (*.docx)</option><option value="doc" style="color: #0b3ea8" customSelectBoxColor="#0b3ea8" customSelectBoxIcon="/images/9.6.0/file_icon/word.png">Word 2003 or older (*.doc)</option><option value="odt" style="color: #0b3ea8" customSelectBoxColor="#0b3ea8" customSelectBoxIcon="/images/9.6.0/file_icon/odf_write.png">OpenDocument Text (*.odt)</option><option value="pdf" disabled="disabled">---</option><option value="xlsx" style="font-weight: bold; color: #006703" customSelectBoxFontWeight="bold" customSelectBoxColor="#006703" customSelectBoxIcon="/images/9.6.0/file_icon/excel.png">Excel 2007-2021 (*.xlsx)</option><option value="xls" style="color: #006703" customSelectBoxColor="#006703" customSelectBoxIcon="/images/9.6.0/file_icon/excel.png">Excel 2003 or older (*.xls)</option><option value="ods" style="color: #006703" customSelectBoxColor="#006703" customSelectBoxIcon="/images/9.6.0/file_icon/odf_calc.png">OpenDocument Sheet (*.ods)</option><option value="pdf" disabled="disabled">---</option><option value="pptx" style="font-weight: bold; color: #d84607" customSelectBoxFontWeight="bold" customSelectBoxColor="#d84607" customSelectBoxIcon="/images/9.6.0/file_icon/powerpoint.png">PowerPoint 2007-2021 (*.pptx)</option><option value="ppt" style="color: #d84607" customSelectBoxColor="#d84607" customSelectBoxIcon="/images/9.6.0/file_icon/powerpoint.png">PowerPoint 2003 or older (*.ppt)</option><option value="odp" style="color: #d84607" customSelectBoxColor="#d84607" customSelectBoxIcon="/images/9.6.0/file_icon/odf_impress.png">OpenDocument Presentation (*.odp)</option><option value="pdf" disabled="disabled">---</option>';
            output_format_options += '<option value="jpg" style="font-weight: bold; color: #900000" customSelectBoxFontWeight="bold" customSelectBoxColor="#900000" customSelectBoxIcon="/images/9.6.0/file_icon/image.png">JPG Image files (*.jpg)</option><option value="png" style="color: #900000" customSelectBoxColor="#900000" customSelectBoxIcon="/images/9.6.0/file_icon/image.png">PNG Image files (*.png)</option><option value="pdf" disabled="disabled">---</option>';
            output_format_options += '<option value="rtf" style="color: #525252" customSelectBoxColor="#525252" customSelectBoxIcon="/images/9.6.0/file_icon/rtf.png">Rich-Text-Format (*.rtf)</option><option value="txt" style="color: #525252" customSelectBoxColor="#525252" customSelectBoxIcon="/images/9.6.0/file_icon/txt.png">Text (*.txt)</option>';
            output_format_options += '<option value="pdf" disabled="disabled">---</option><option value="epub" style="color: #2865e3" customSelectBoxColor="#2865e3" customSelectBoxIcon="/images/9.6.0/file_icon/ebook.png">EPUB E-Book (*.epub)</option><option value="mobi" style="color: #2865e3" customSelectBoxColor="#2865e3" customSelectBoxIcon="/images/9.6.0/file_icon/ebook.png">MOBI E-Book (*.mobi)</option><option value="azw3" style="color: #2865e3" customSelectBoxColor="#2865e3" customSelectBoxIcon="/images/9.6.0/file_icon/ebook.png">AZW3 Amazon Kindle (*.azw3)</option>';
        }
        output_format_options += '</select>';
        output_format_box.innerHTML = output_format_options;
        if (dropdown_value_exists(document.forms[0].elements['output_format'], output_format)) {
            document.forms[0].elements['output_format'].value = output_format;
            output_format = document.forms[0].elements['output_format'].value;
        } else {
            document.forms[0].elements['output_format'].value = 'pdf';
            output_format = document.forms[0].elements['output_format'].value;
            output_dropdown_set = false;
            if (splitted_conversion == true || mixed_merge_selected == true) {
                show_output_box_always = true;
            }
        }
        if (!output_dropdown_set && dropdown_value_exists(document.forms[0].elements['output_format'], preferred_output_format)) {
            if (ocr_enabled) {
                document.forms[0].elements['export_ocr'].value = 'yes';
                export_ocr = true;
                ocr_dropdown_set = true;
            }
            document.forms[0].elements['output_format'].value = preferred_output_format;
            output_format = document.forms[0].elements['output_format'].value;
            output_dropdown_set = true;
        }
        if (splitted_conversion == true) {
            if (show_output_box_always == true) {
                display['convert_to_box'] = 'block';
                output_format_box.disabled = true;
            } else {
                conversion_box.style.display = 'none';
            }
            splitting_info.style.display = 'block';
            document.forms[0].elements['output_format'].value = 'pdf';
            output_format = document.forms[0].elements['output_format'].value;
            download_file_zipped = true;
        } else {
            display['convert_to_box'] = 'block';
            if (getFileNumber() >= 2) {
                display['conversion_mode_box'] = 'block';
                conversion_mode_info_box.style.display = 'inline-block';
                if (conversion_mode == 'merge') {
                    conversion_mode_info.innerHTML = '(all files are merged in a row)';
                    if (getFileNumber() == 2 && mixed_merge == true) {
                        display['merge_mode_box'] = 'inline';
                        conversion_mode_info.innerHTML = '';
                        if (merge_mode == 'mixed') {
                            merge_info.style.display = 'block';
                            document.forms[0].elements['output_format'].value = 'pdf';
                            output_format = 'pdf';
                            if (show_output_box_always == true) {
                                display['convert_to_box'] = 'block';
                                output_format_box.disabled = true;
                            } else {
                                display['convert_to_box'] = 'none';
                            }
                        }
                    }
                } else if (conversion_mode == 'single') {
                    conversion_mode_info.innerHTML = '(download as ZIP archive)';
                    download_file_zipped = true;
                    separated_conversion = true;
                }
            }
            if (output_format == 'pdf_single_page') {
                download_file_zipped = true;
                single_page_conversion = true;
            }
        }
    } else {
        conversion_box.style.display = 'none';
    }
    if (output_format != 'pdf' && output_format != 'pdf_searchable' && output_format != 'pdf_image' && output_format != 'pdf_single_page' && output_format != 'jpg' && output_format != 'png' && output_format != 'epub' && output_format != 'mobi' && output_format != 'azw3') {
        display['export_box'] = 'block';
        if (images_included) {
            if (output_format == 'xlsx' || output_format == 'xls' || output_format == 'ods' || output_format == 'txt') {
                export_ocr_box.style.display = 'none';
                document.forms[0].elements['export_ocr'].value = 'yes';
                export_ocr = true;
            }
            if (ocr_dropdown_set == false) {
                document.forms[0].elements['export_ocr'].value = 'yes';
                export_ocr = true;
            }
        } else {
            if (ocr_dropdown_set == false) {
                document.forms[0].elements['export_ocr'].value = 'no';
                export_ocr = false;
            }
        }
        if (export_ocr) {
            var info_content_text = 'Using this type of conversion only a <b>maximum of 30 pages</b> will be converted.';
            if (non_images_included) {
                info_content_text += ' If you need only specific pages, please define them <b>before</b> the conversion (red button with the scissor on the right of the file).';
            }
            conversion_info_array.push(info_content_text);
            display['export_ocr_language_box'] = 'inline-block';
            if (non_images_included) {
                display['export_fullocr_box'] = 'block';
            }
        } else {
            conversion_info_array.push('By using this type of conversion only a <b>maximum of 150 pages</b> will be converted. If you need only specific pages, please define them <b>before</b> the conversion (red button with the scissor on the right of the file).');
            if (export_image) {
                conversion_info_array.push('All pages are inserted as images. Thus, contained text will not be editable, but you can insert text layers (e.g. to fill forms or to add additional text in presentations)');
            } else {
                conversion_info_array.push('Depending on the content and structure of the file, the converted file may differ from the original.');
            }
        }
    }
    var output_text_only = false;
    switch (output_format) {
        case 'pdf':
        case 'pdf_searchable':
        case 'pdf_image':
        case 'pdf_single_page':
            if (output_format == 'pdf_searchable' && only_pdf_xps_images) {
                display['pdf_advanced_ocr_language_box'] = 'inline-block';
                conversion_info_array.push('This option should be chosen only if the files contain <b>scanned pages</b> or if the text has a wrong character encoding and therefore copying or searching is currently not possible.');
                conversion_info_array.push('During conversion an optical character recognition (OCR) is applied. Afterwards, all pages are getting <b>searchable</b> and the text will be <b>copyable</b> too.');
                conversion_info_array.push('When doing this type of conversion, only <b>maximum 30 pages</b> are converted. If you want to convert only specific pages, please define them <b>before the conversion</b> (red button with scissor on the right side of the file).');
            } else if (output_format == 'pdf_image') {
                conversion_info_array.push('This option should be chosen only if you want to make this PDF behave like a scanned document.');
                conversion_info_array.push('Text in the PDF <b>will not be copyable</b> and the PDF will not be searchable either. Because all pages are images only, the resulted file is bigger in most cases.');
                conversion_info_array.push('By using this type of conversion only a <b>maximum of 150 pages</b> will be converted. If you need only specific pages, please define them <b>before</b> the conversion (red button with the scissor on the right of the file).');
            }
            if (output_format == 'pdf_searchable') {
                pdf_advanced_ocr_language_title.style.color = '#AA0000';
            } else {
                convert_to_title.style.color = '#AA0000';
            }
            break;
        case 'epub':
        case 'mobi':
        case 'azw3':
            conversion_info_array.push('By using this type of conversion only a <b>maximum of 150 pages</b> will be converted. If you need only specific pages, please define them <b>before</b> the conversion (red button with the scissor on the right of the file).');
            convert_to_title.style.color = '#AA0000';
            break;
        case 'jpg':
        case 'png':
            conversion_info_array.push('By using this type of conversion only a <b>maximum of 150 pages</b> will be converted. If you need only specific pages, please define them <b>before</b> the conversion (red button with the scissor on the right of the file).');
            download_file_zipped = true;
            convert_to_title.style.color = '#AA0000';
            break;
        case 'xls':
        case 'xlsx':
        case 'ods':
        case 'txt':
            output_text_only = true;
        default:
            if (!export_ocr && !images_included) {
                if (output_text_only) {
                    conversion_info_array.push('With the currently chosen option, <b>no</b> character recognition will be applied in scanned documents and images. Only real text and table elements are getting editable. Images will not be converted.<br>In order to edit text in images or scans, you have to enable OCR.');
                } else {
                    if (!export_image) {
                        conversion_info_array.push('With the currently chosen option, <b>no</b> character recognition will be applied in scanned documents and images. Only real text and table elements are getting editable. Images remain images.<br>In order to edit text in images or scans, you have to enable OCR.');
                    }
                    display['export_image_box'] = 'block';
                }
            } else {
                if (export_fullocr && non_images_included) {
                    conversion_info_array.push('Each page is handled as image and an optical character recognition (OCR) is applied for the whole content in the selected language. Depending on the content, this may lead to errors and deviations.');
                    conversion_info_array.push('The option <b>Advanced OCR</b> is useful if the file contains text with a wrong character encoding and therefore wrong characters or symbols appear (e.g. in the converted file or when copying text).');
                } else {
                    conversion_info_array.push('An optical character recognition (OCR) in images and scanned documents will be performed in your chosen language. Depending on the image quality this can lead to deviations and incorrect recognitions. ');
                }
            }
    }
    var conversion_info_text = '';
    for (var i = 0; i < conversion_info_array.length; i++) {
        conversion_info_text += '<li>' + conversion_info_array[i] + '</li>';
    }
    if (conversion_info_text.length > 0) {
        display['conversion_info'] = 'block';
        document.getElementById('conversion_info_inner').innerHTML = '<ul>' + conversion_info_text + '</ul>';
    }
    change_display_options(display);
    if (export_ocr) {
        export_title.style.color = '#007700';
    } else {
        export_title.style.color = '#AA0000';
    }
    activate_preferences(images_included, non_images_included, excel_included, document.forms[0].elements['output_format'].value, export_ocr);
    generateSelectBoxes();
}

function dropdown_value_exists(select_box, value) {
    for (var i = 0; i < select_box.options.length; i++) {
        if (select_box.options[i].value == value) {
            return true;
        }
    }
    return false;
}

function reset_display_options(options) {
    for (x in options) {
        change_display_option(x, 'nofade');
    }
}

function change_display_options(options) {
    for (x in options) {
        change_display_option(x, options[x]);
    }
}

function change_display_option(option, display) {
    if (display == 'nofade') {
        document.getElementById(option).style.animation = '';
        document.getElementById(option).style.MozAnimation = '';
        document.getElementById(option).style.WebkitAnimation = '';
        return;
    }
    if (document.getElementById(option).style.display == display) {
        return;
    }
    document.getElementById(option).style.display = display;
    if (display != 'none') {
        document.getElementById(option).style.animation = 'fadein 1s';
        document.getElementById(option).style.MozAnimation = 'fadein 1s';
        document.getElementById(option).style.WebkitAnimation = 'fadein 1s';
    }
}

function activate_preferences(images_included, non_images_included, excel_included, output_type, ocr) {
    var pref = document.getElementById('preferences');
    pref.style.display = 'block';
    var format = 'PDF';
    switch (output_type) {
        case 'doc':
        case 'docx':
        case 'odt':
        case 'ppt':
        case 'pptx':
        case 'odp':
        case 'rtf':
        case 'jpg':
        case 'png':
        case 'txt':
        case 'xls':
        case 'xlsx':
        case 'ods':
            format = output_type.toUpperCase();
            break;
    }
    var pref_name = document.getElementById('pref_menu_element_3').innerHTML;
    var pos = pref_name.lastIndexOf('-');
    if (pos == -1) {
        pos = pref_name.lastIndexOf(' ');
    }
    if (pos > 0) {
        document.getElementById('pref_menu_element_3').innerHTML = pref_name.substr(0, pos + 1) + format;
    }
    if (getFileNumber() >= 1) {
        var color_options = '<option value="color">Color</option><option value="gray">Black-and-White (gray scale)</option>';
        var color_options_value = document.forms['form1'].elements['color'].value;
        if (images_included || output_type == 'pdf_image' || output_type == 'pdf_searchable' || output_type == 'png') {
            color_options += '<option value="monochrome">Black-and-White (monochrome)</option>';
        }
        document.forms['form1'].elements['color'].innerHTML = color_options;
        if (dropdown_value_exists(document.forms['form1'].elements['color'], color_options_value)) {
            document.forms['form1'].elements['color'].value = color_options_value;
        } else {
            document.forms['form1'].elements['color'].value = 'gray';
        }
        switch (output_type) {
            case 'pdf':
            case 'pdf_searchable':
            case 'pdf_image':
            case 'pdf_single_page':
                preferences_menu_show(1);
                preferences_menu_show(2);
                if (images_included) {
                    preferences_menu_show(3);
                } else {
                    preferences_menu_hide(3);
                }
                preferences_menu_show(4);
                preferences_menu_show(5);
                if (excel_included) {
                    preferences_menu_show(6);
                } else {
                    preferences_menu_hide(6);
                }
                preferences_menu_show(7);
                break;
            case 'jpg':
            case 'png':
                preferences_menu_show(1);
                preferences_menu_hide(2);
                if (images_included) {
                    preferences_menu_show(3);
                } else {
                    preferences_menu_hide(3);
                }
                for (var i = 4; i <= 5; i++) {
                    preferences_menu_hide(i);
                }
                if (excel_included) {
                    preferences_menu_show(6);
                } else {
                    preferences_menu_hide(6);
                }
                preferences_menu_hide(7);
                break;
            case 'xls':
            case 'xlsx':
            case 'ods':
                preferences_menu_hide(1);
                preferences_menu_hide(2);
                if (images_included) {
                    preferences_menu_show(3);
                } else {
                    preferences_menu_hide(3);
                }
                preferences_menu_hide(4);
                preferences_menu_hide(5);
                preferences_menu_show(6);
                preferences_menu_hide(7);
                break;
            case 'mobi':
            case 'epub':
            case 'azw3':
                preferences_menu_show(1);
                for (var i = 2; i <= 5; i++) {
                    preferences_menu_hide(i);
                }
                if (excel_included) {
                    preferences_menu_show(6);
                } else {
                    preferences_menu_hide(6);
                }
                preferences_menu_hide(7);
                break;
            case 'txt':
                preferences_menu_hide(1);
                preferences_menu_hide(2);
                preferences_menu_show(3);
                preferences_menu_hide(4);
                preferences_menu_hide(5);
                if (excel_included) {
                    preferences_menu_show(6);
                } else {
                    preferences_menu_hide(6);
                }
                preferences_menu_hide(7);
                break;
            default:
                if (!ocr) {
                    preferences_menu_show(1);
                } else {
                    preferences_menu_hide(1);
                }
                preferences_menu_hide(2);
                if (images_included) {
                    preferences_menu_show(3);
                } else {
                    preferences_menu_hide(3);
                }
                for (var i = 4; i <= 5; i++) {
                    preferences_menu_hide(i);
                }
                if (excel_included) {
                    preferences_menu_show(6);
                } else {
                    preferences_menu_hide(6);
                }
                preferences_menu_hide(7);
                if (ocr && !excel_included && !images_included) {
                    pref.style.display = 'none';
                }
                break;
        }
    } else {
        for (var i = 1; i <= 7; i++) {
            preferences_menu_show(i);
        }
    }
}

function conversion_mode_change() {
    activate_features();
}

function output_format_change(element) {
    activate_features();
}

function ocr_dropdown_change() {
    ocr_dropdown_set = true;
    activate_features();
}

function sendLog(msg, type) {
    if (type == undefined) {
        type = '';
    }
    xmlhttpLog.open('POST', '/log', true);
    xmlhttpLog.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttpLog.send('msg=' + encodeURIComponent(msg) + '&type=' + encodeURIComponent(type));
}

function upload() {
    connection_timeout = false;
    frame_load_listener(true);
    var emptyFileInput = new Object();
    try {
        if (navigator.userAgent.indexOf('Apple') != -1) {
            var elements = document.getElementsByTagName('input');
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].getAttribute('type') == 'file') {
                    if (elements[i].files) {
                        if (elements[i].files.length == 0) {
                            emptyFileInput[i] = elements[i].getAttribute('name');
                            elements[i].removeAttribute('name');
                        }
                    }
                }
            }
        }
    } catch (err) {}
    if (window.FormData) {
        var data = new FormData(document.forms['form1']);
        var dropped_files_count = 0;
        for (var key in dropped_files) {
            for (var i = 0; i < dropped_files[key].length; i++) {
                data.append(key + '[' + i + ']', dropped_files[key][i]);
                dropped_files_count++;
            }
        }
        if (dropped_files_count == 0 && (connection_aborted_counter > 0 || upload_retry > 0)) {
            document.domain = 'online2pdf.com';
            document.getElementById('progress_bar_container').style.display = 'none';
            document.forms['form1'].action = server + '/conversion/frame';
            document.forms['form1'].submit();
        } else {
            document.getElementById('progress_bar_container').style.display = 'block';
            document.getElementById('progress_bar_container').innerHTML = '<div class="progress_bar" id="progress_bar"></div>';
            xmlhttp.upload.addEventListener('progress', uploadProgress, false);
            xmlhttp.onreadystatechange = conversionResultAjax;
            xmlhttp.open('POST', server + '/conversion/ajax', true);
            xmlhttp.withCredentials = true;
            xmlhttp.send(data);
        }
    } else {
        document.domain = 'online2pdf.com';
        document.forms['form1'].action = server + '/conversion/frame';
        document.forms['form1'].submit();
    }
    try {
        for (var elem in emptyFileInput) {
            elements[elem].setAttribute('name', emptyFileInput[elem]);
        }
    } catch (err) {}
}

function conversionResultAjax() {
    if (xmlhttp.readyState == 4) {
        conversionResult(xmlhttp.responseText, true);
    }
}

function conversionResult(response, xhr_connection) {
    if (xhr_connection == undefined) {
        xhr_connection = false;
    }
    document.getElementById('feedback_info').style.display = 'inline-block';
    if (running == false) {
        return;
    }
    frame_load_listener(false);
    var conversion_result;
    try {
        conversion_result = eval('(' + response + ')');
        connection_aborted_counter = 0;
    } catch (e) {
        connection_aborted_counter++;
        var status = 'frame';
        if (xhr_connection) {
            status = xmlhttp.status;
        }
        if (connection_aborted_counter == 1 && connection_aborted_by_user == false) {
            if (status == 0) {
                sendLog('Upload: status = 0, #' + connection_aborted_counter);
            } else {
                if (xhr_connection) {
                    var dropped_files_count = 0;
                    for (var key in dropped_files) {
                        for (var i = 0; i < dropped_files[key].length; i++) {
                            dropped_files_count++;
                        }
                    }
                    sendLog('Upload error: conversionResult #' + connection_aborted_counter + ', dropped_files_count: ' + dropped_files_count + ', file_count: ' + (file_count - 1) + ', xhr_status: ' + status + ': ' + response);
                } else {
                    sendLog('Upload error: conversionResult #' + connection_aborted_counter + ' (frame): ' + response);
                }
            }
            hide_all_windows();
            checkServerStatus();
            return;
        }
        if (connection_aborted_by_user) {
            connectionInterrupted('Upload: aborted by user');
            return;
        } else if (status == 0) {
            connectionInterrupted('Upload: status = 0, #' + connection_aborted_counter, true);
            return;
        } else {
            connectionInterrupted('Upload: conversionResult #' + connection_aborted_counter + ' (' + status + '): ' + response, true);
            return;
        }
    }
    if (conversion_result['action'] != undefined && conversion_result['id'] != undefined) {
        if (conversion_result['action'] == 'uploaded') {
            uid = conversion_result['id'];
            step_begin = new Date();
            progress_error = 0;
            if (window.FormData) {
                getProgressFrame(createXHR(), getProgressInternal);
            } else {
                document.domain = 'online2pdf.com';
                document.getElementById('progress_frame').innerHTML = '<iframe src="' + server + '/progress_frame?sid=' + sid + '&uid=' + uid + '&v=' + v + '" style="width: 0px; height: 0px; border: 0px solid #000000"></iframe>';
            }
        }
    }
}

function httpTimeoutChecker(http, timeout, f) {
    httpTimer = window.setTimeout(function() {
        connection_timeout = true;
        http.abort();
        f();
    }, timeout * 1000);
}

function httpTimeoutAbort() {
    window.clearTimeout(httpTimer);
}

function connectionInterrupted(msg, extendedMessage) {
    if (extendedMessage == undefined) {
        extendedMessage = false;
    }
    hide_all_windows();
    document.getElementById('alert_window').style.display = 'block';
    document.getElementById('alert_window_title').innerHTML = 'Connection interrupted';
    if (extendedMessage) {
        document.getElementById('alert_window_msg').innerHTML = '<p>The connection to the server has been interrupted. Please try it again.</p><div style="color: #AA0000; border: 1px solid #AA0000; border-radius: 5px; padding: 10px; background: #FFFFDD"><b>Important:</b> If you&#39;re getting the warning <b>"Not secure"</b> in the address bar and if you&#39;re using an old operating system without current updates (like Windows 7 or Windows XP), please use the browser <b>Firefox</b>!<br>Firefox includes all necessary security certificates even on older operating systems so that this converter is working properly.</div><p>Please make sure that your files are not used by another program and that your files are locally available on your computer (and not on an external server like OneDrive).</p><p>If the problem persists and you are connected to the internet via a proxy server, then probably this proxy server may cause this issue (due to timeouts or size limits).</p>';
    } else {
        document.getElementById('alert_window_msg').innerHTML = 'The connection to the server has been interrupted. Please try it again.';
    }
    conversion_result_event();
    sendLog('Connection interrupted: ' + msg);
}

function checkFiles() {
    var nodes = document.getElementsByTagName('div');
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.className == 'div_file_error') {
            return false;
        }
    }
    return true;
}

function checkServerStatus() {
    init_windows();
    conversion_done = true;
    if (checkFiles() == false) {
        display_message('Please fix the displayed errors.');
        return;
    }
    document.getElementById('feedback_info').style.display = 'none';
    c = 0;
    var nodes = document.getElementById('files').childNodes;
    var file_box_prefix = 'div_file_box';
    var file_order = '';
    var output_format = document.forms[0].elements['output_format'].value;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType == 1 && nodes[i].getAttribute('id') != null) {
            file_order += nodes[i].getAttribute('id').substr(file_box_prefix.length) + ';';
        }
    }
    document.forms['form1'].elements['file_order'].value = file_order;
    var file_ext = output_format;
    if (file_ext == 'pdf_searchable' || file_ext == 'pdf_image' || file_ext == 'pdf_single_page') {
        file_ext = 'pdf';
    }
    file_ext = file_ext.toUpperCase();
    if (download_file_zipped == true) {
        file_ext = file_ext + '/ZIP';
    }
    var upload_info_1 = '';
    var upload_info_2 = '';
    if (getFileNumber() >= 2) {
        upload_info_1 = 'Your files are being uploaded and processed. Please wait...';
    } else {
        upload_info_1 = 'Your file is being uploaded and processed. Please wait...';
    }
    upload_info_2 = 'The download will be started <b>automatically</b> when this process is finished and the %FILE_EXT% file is created.';
    upload_info_2 = upload_info_2.replace('%FILE_EXT%', file_ext);
    show_advertising_horizontal_box(false);
    document.getElementById('main_window').style.display = 'none';
    document.getElementById('progress_window').style.display = 'block';
    document.getElementById('upload_info_1').innerHTML = upload_info_1;
    document.getElementById('upload_info_2').innerHTML = upload_info_2;
    document.getElementById('progress').innerHTML = (getFileNumber() >= 2) ? 'Uploading your files...' : 'Uploading your file...';
    window.setTimeout('changeWaitImage()', 30);
    xmlhttpCheck.onreadystatechange = checkServerStatusResult;
    xmlhttpCheck.open('POST', '/check', true);
    xmlhttpCheck.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttpCheck.send('v=' + v + '&ab=' + document.forms[0].elements['ab'].value);
    httpTimeoutChecker(xmlhttpCheck, 60, function() {});
    scrollToElement('progress_window');
}

function scrollToElement(id) {
    var screen = getScreenSize();
    var scrolledTop = getScrollPosition()[1];
    var obj = document.getElementById(id);
    var top = getObjectPosition(obj)[1];
    if (screen[1] < obj.offsetHeight) {
        window.scrollTo(0, top);
    } else if (scrolledTop > top - 100 || scrolledTop + screen[1] < top + obj.offsetHeight + 150) {
        var scrollTo = top + obj.offsetHeight / 2 - screen[1] / 2;
        window.scrollTo(0, scrollTo);
    }
}

function getScreenSize() {
    var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    return [w, h];
}

function getScreenSizeWithoutScrollbars() {
    var w = document.documentElement.clientWidth || document.body.clientWidth;
    var h = document.documentElement.clientHeight || document.body.clientHeight;
    return [w, h];
}

function getObjectPosition(obj) {
    var left = 0;
    var top = 0;
    if (obj.offsetParent) {
        do {
            left += obj.offsetLeft;
            top += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    return [left, top];
}

function checkServerStatusResult() {
    if (xmlhttpCheck.readyState == 4) {
        httpTimeoutAbort();
        var check_result;
        try {
            check_result = eval('(' + xmlhttpCheck.responseText + ')');
        } catch (e) {
            if (connection_aborted_by_user) {
                connectionInterrupted('checkServerStatus: aborted by user');
                return;
            } else if (connection_timeout) {
                connection_timeout = false;
                connectionInterrupted('checkServerStatus: timeout');
                return;
            } else if (xmlhttpCheck.status == 0) {
                connectionInterrupted('checkServerStatus: status = 0');
                return;
            } else {
                connectionInterrupted('checkServerStatus: parse error (status: ' + xmlhttpCheck.status + '): ' + xmlhttpCheck.responseText);
                return;
            }
        }
        if (check_result['action'] != undefined) {
            switch (check_result['action']) {
                case 'ready':
                    if (check_result['server'] != undefined && check_result['cid'] != undefined && check_result['server'] != '') {
                        server = '//' + check_result['server'] + '.online2pdf.com';
                        var cid = check_result['cid'].toUpperCase();
                        var cid2 = '';
                        for (var i = 0; i < cid.length; i++) {
                            cid2 = cid2 + cid.charAt(cid.length - 1 - i).charCodeAt(0);
                        }
                        cid2 = cid2.substr(3) + cid2.substr(0, 3);
                        document.forms[0].elements['cid'].value = cid2;
                    }
                    upload();
                    break;
                case 'message':
                    if (check_result['type'] != undefined && check_result['title'] != undefined && check_result['content'] != undefined) {
                        switch (check_result['type']) {
                            case 'error':
                                hide_all_windows();
                                document.getElementById('progress_frame').innerHTML = '';
                                document.getElementById('error_window').style.display = 'block';
                                document.getElementById('error_window_title').innerHTML = check_result['title'];
                                document.getElementById('error_window_msg').innerHTML = check_result['content'];
                                conversion_result_event();
                                break;
                            case 'alert':
                                hide_all_windows();
                                document.getElementById('progress_frame').innerHTML = '';
                                document.getElementById('alert_window').style.display = 'block';
                                document.getElementById('alert_window_title').innerHTML = check_result['title'];
                                document.getElementById('alert_window_msg').innerHTML = check_result['content'];
                                conversion_result_event();
                                break;
                            case 'alert_nb':
                                hide_all_windows();
                                document.getElementById('progress_frame').innerHTML = '';
                                document.getElementById('alert_nb_window').style.display = 'block';
                                document.getElementById('alert_nb_window_title').innerHTML = check_result['title'];
                                document.getElementById('alert_nb_window_msg').innerHTML = check_result['content'];
                                conversion_result_event();
                                break;
                            default:
                        }
                    }
                    break;
                case 'reload':
                    hide_all_windows();
                    show_message_reload();
                    break;
                default:
            }
        }
    }
}

function uploadProgress(e) {
    if (running) {
        var upload_text = (getFileNumber() >= 2) ? 'Uploading your files...' : 'Uploading your file...';
        document.getElementById('progress').innerHTML = upload_text + '(' + Math.round(e.loaded / e.total * 100) + '%)';
        document.getElementById('progress_bar').style.width = (e.loaded / e.total * 100) + '%';
    }
}

function getProgressFrame(http, f) {
    xmlhttpProgress = http;
    getProgressFunc = f;
    getProgress();
}

function getProgressInternal() {
    xmlhttpProgress.onreadystatechange = refreshProgress;
    xmlhttpProgress.open('POST', server + '/progress', true);
    xmlhttpProgress.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttpProgress.withCredentials = true;
    xmlhttpProgress.send('sid=' + sid + '&uid=' + uid + '&v=' + v);
}

function getProgress() {
    httpTimeoutChecker(xmlhttpProgress, 60, function() {});
    getProgressFunc();
}

function refreshProgress() {
    if (xmlhttpProgress.readyState == 4) {
        httpTimeoutAbort();
        try {
            var progress_info = eval('(' + xmlhttpProgress.responseText + ')');
            var completed = false;
            var fileNumber = getFileNumber();
            var output_format = document.forms[0].elements['output_format'].value;
            var status = '';
            progress_error = 0;
            if (progress_info['action'] != undefined && progress_info['type'] != undefined && progress_info['action'] == 'message') {
                hide_all_windows();
                switch (progress_info['type']) {
                    case 'completed':
                        if (progress_info['url'] != undefined) {
                            document.getElementById('completed_window').style.display = 'block';
                            add_download_finished_advertising();
                            document.getElementById('completed_window_warnings').style.display = 'none';
                            document.getElementById('completed_window_info_booklet_duplex_long_edge').style.display = 'none';
                            document.getElementById('completed_window_info_booklet_duplex_short_edge').style.display = 'none';
                            document.getElementById('completed_window_info_booklet_paperfeed_front').style.display = 'none';
                            document.getElementById('completed_window_info_booklet_paperfeed_back').style.display = 'none';
                            if (progress_info['warnings'] != undefined && progress_info['warnings'] != '') {
                                if (progress_info['warnings'] == 'booklet') {
                                    if (document.forms[0].elements['layout_printer_mode'].value == 'duplex') {
                                        document.getElementById('completed_window_info_booklet_duplex_long_edge').style.display = 'block';
                                    } else if (document.forms[0].elements['layout_printer_mode'].value == 'duplex_short_edge') {
                                        document.getElementById('completed_window_info_booklet_duplex_short_edge').style.display = 'block';
                                    } else if (document.forms[0].elements['layout_printer_mode'].value == 'paperfeed_front') {
                                        document.getElementById('completed_window_info_booklet_paperfeed_front').style.display = 'block';
                                    } else if (document.forms[0].elements['layout_printer_mode'].value == 'paperfeed_back') {
                                        document.getElementById('completed_window_info_booklet_paperfeed_back').style.display = 'block';
                                    }
                                } else {
                                    document.getElementById('completed_window_warnings').style.display = 'block';
                                    document.getElementById('completed_window_warnings_content').innerHTML = progress_info['warnings'];
                                }
                            }
                            document.getElementById('completed_window_link_container').style.display = 'block';
                            document.getElementById('completed_window_link_waiting').style.display = 'block';
                            document.getElementById('completed_window_link').style.display = 'none';
                            document.getElementById('completed_window_link').innerHTML = 'Download does not start? <a href="' + progress_info['url'] + '" style="display: inline-block">Manual download</a> <span style="display: inline-block">(valid for 60 seconds)</span><div class="download_link_info" style="margin-top: 5px; font-size: 12px; color: #333333; text-align: center">(<b>Right-click</b> on the download link and select <b><i>Save target as...</i></b>)</div>';
                            window.setTimeout(function() {
                                document.getElementById('completed_window_link').style.display = 'block';
                                document.getElementById('completed_window_link_waiting').style.display = 'none';
                            }, 5000);
                            download_link_timer = window.setTimeout(function() {
                                document.getElementById('completed_window_link_container').style.display = 'none';
                            }, 60000);
                            window.upload_frame.window.location.href = progress_info['url'];
                            conversion_result_event();
                            scrollToElement('completed_window');
                        }
                        break;
                    case 'error':
                        if (progress_info['title'] != undefined && progress_info['content'] != undefined) {
                            if (progress_info['subtype'] != undefined && progress_info['subtype'] == 'empty_file_content') {
                                if (upload_retry == 0) {
                                    upload_retry++;
                                    hide_all_windows();
                                    checkServerStatus();
                                    return;
                                }
                                upload_retry = 0;
                            }
                            document.getElementById('progress_frame').innerHTML = '';
                            document.getElementById('error_window').style.display = 'block';
                            document.getElementById('error_window_title').innerHTML = progress_info['title'];
                            document.getElementById('error_window_msg').innerHTML = progress_info['content'];
                            conversion_result_event();
                            scrollToElement('error_window');
                        }
                        break;
                    case 'alert':
                        if (progress_info['title'] != undefined && progress_info['content'] != undefined) {
                            document.getElementById('progress_frame').innerHTML = '';
                            document.getElementById('alert_window').style.display = 'block';
                            document.getElementById('alert_window_title').innerHTML = progress_info['title'];
                            document.getElementById('alert_window_msg').innerHTML = progress_info['content'];
                            conversion_result_event();
                            scrollToElement('alert_window');
                        }
                        break;
                    default:
                }
                completed = true;
            } else if (progress_info['action'] != undefined && progress_info['step'] != undefined && progress_info['file'] != undefined && progress_info['files'] != undefined && progress_info['action'] == 'progress') {
                if (last_step != progress_info['step']) {
                    step_begin = new Date();
                }
                last_step = progress_info['step'];
                document.getElementById('progress_bar_container').style.display = 'none';
                switch (progress_info['step']) {
                    case 2:
                        if (output_format == 'pdf' || output_format == 'pdf_searchable' || output_format == 'pdf_image' || output_format == 'pdf_single_page') {
                            status = 'Conversion: File %CURRENT_FILE% of %FILES_TOTAL% is being processed...';
                            status = status.replace('%CURRENT_FILE%', progress_info['file']);
                            status = status.replace('%FILES_TOTAL%', progress_info['files']);
                        } else {
                            status = 'Reading file: File %CURRENT_FILE% of %FILES_TOTAL% is being processed...';
                            status = status.replace('%CURRENT_FILE%', progress_info['file']);
                            status = status.replace('%FILES_TOTAL%', progress_info['files']);
                        }
                        break;
                    case 3:
                        if (output_format == 'pdf' || output_format == 'pdf_searchable' || output_format == 'pdf_image' || output_format == 'pdf_single_page') {
                            if (fileNumber >= 2) {
                                if (separated_conversion == true) {
                                    status = 'PDF files are being revised and finished...';
                                } else if (single_page_conversion == true || splitted_conversion == true) {
                                    status = 'PDF files are being splitted, edited and finished.';
                                } else {
                                    status = 'Files are being merged and the PDF file is being finished...';
                                }
                            } else {
                                if (single_page_conversion == true || splitted_conversion == true) {
                                    status = 'PDF file is being splitted, edited and finished.';
                                } else {
                                    status = 'PDF is being revised and finished...';
                                }
                            }
                        } else {
                            if (fileNumber >= 2) {
                                if (separated_conversion == false) {
                                    status = 'Files are being merged, revised and prepared for conversion...';
                                } else {
                                    status = 'Files are being revised and prepared for conversion...';
                                }
                            } else {
                                status = 'File is being revised and the conversion is being prepared...';
                            }
                        }
                        break;
                    case 4:
                        if (output_format == 'pdf_searchable') {
                            if (separated_conversion == false) {
                                status = 'The PDF file is made searchable...';
                            } else {
                                status = 'PDF file %CURRENT_FILE% of %FILES_TOTAL% is made searchable...';
                                status = status.replace('%CURRENT_FILE%', progress_info['file']);
                                status = status.replace('%FILES_TOTAL%', progress_info['files']);
                            }
                        } else if (output_format == 'pdf_image') {
                            if (separated_conversion == false) {
                                status = 'The PDF file is converted to an Image-PDF...';
                            } else {
                                status = 'PDF file %CURRENT_FILE% of %FILES_TOTAL% is converted to an Image-PDF...';
                                status = status.replace('%CURRENT_FILE%', progress_info['file']);
                                status = status.replace('%FILES_TOTAL%', progress_info['files']);
                            }
                        } else {
                            var output_format_text = '';
                            switch (output_format) {
                                case 'doc':
                                case 'docx':
                                    output_format_text = 'Microsoft Word';
                                    break;
                                case 'xls':
                                case 'xlsx':
                                    output_format_text = 'Microsoft Excel';
                                    break;
                                case 'ppt':
                                case 'pptx':
                                    output_format_text = 'Microsoft Powerpoint';
                                    break;
                                case 'rtf':
                                    output_format_text = 'Rich-Text-Format';
                                    break;
                                case 'txt':
                                    output_format_text = 'Text';
                                    break;
                                case 'odt':
                                    output_format_text = 'OpenDocument Text';
                                    break;
                                case 'ods':
                                    output_format_text = 'OpenDocument Sheet';
                                    break;
                                case 'odp':
                                    output_format_text = 'OpenDocument Presentation';
                                    break;
                                case 'jpg':
                                case 'png':
                                    output_format_text = 'Image files';
                                    break;
                                case 'azw3':
                                case 'mobi':
                                case 'epub':
                                    output_format_text = 'E-Book';
                                    break;
                                default:
                                    break;
                            }
                            if (separated_conversion == false) {
                                status = 'Conversion: File is being converted to %OUTPUT_FORMAT%...';
                                status = status.replace('%OUTPUT_FORMAT%', '"' + output_format_text + '" (.' + output_format + ')');
                            } else {
                                status = 'Conversion: File %CURRENT_FILE% of %FILES_TOTAL% is being converted to %OUTPUT_FORMAT%...';
                                status = status.replace('%CURRENT_FILE%', progress_info['file']);
                                status = status.replace('%FILES_TOTAL%', progress_info['files']);
                                status = status.replace('%OUTPUT_FORMAT%', output_format_text);
                            }
                        }
                        break;
                    default:
                        break;
                }
                if (status != '') {
                    if (last_current_file != progress_info['file']) {
                        step_begin = new Date();
                    }
                    last_current_file = progress_info['file'];
                    document.getElementById('progress').innerHTML = status;
                }
            }
            var duration = 0;
            if (step_begin != null) {
                duration = new Date().getTime() - step_begin.getTime();
            }
            var progress_note = document.getElementById('progress_note');
            var progress_note_content = document.getElementById('progress_note_content');
            var progress_note_msg = document.getElementById('progress_note_msg');
            if (duration > 180000 && last_step > 1 && last_step < 5) {
                progress_note.style.display = 'block';
                progress_note_content.style.border = '1px solid #ffa31e';
                progress_note_content.style.backgroundColor = '#ffe6c3';
                progress_note_msg.innerHTML = '<b>The conversion is taking more time than usual.</b><br>That is because your files contain a lot of content/pages or the server is busy right now. If the conversion does not finish in the next minutes, please try again later. Thank you for your understanding.';
            } else if (duration > 15000 && last_step < 5) {
                progress_note.style.display = 'block';
                progress_note_content.style.border = '1px solid #999999';
                progress_note_content.style.backgroundColor = '#FFFFFF';
                if (last_step == 0) {
                    progress_note_msg.innerHTML = 'Please be patient. Depending on your internet connection and the amount of data, the upload may take some time.';
                } else {
                    progress_note_msg.innerHTML = 'Please be patient. Some conversions may take some time.';
                }
            } else {
                progress_note.style.display = 'none';
            }
            if (duration > 1800000) {
                completed = true;
                connectionInterrupted('getProgress - execution limit exceeded');
            }
            if (completed == false) {
                window.setTimeout(getProgress, 1000);
            }
        } catch (e) {
            var duration = 0;
            if (step_begin != null) {
                duration = new Date().getTime() - step_begin.getTime();
            }
            progress_error++;
            if (connection_aborted_by_user == false && progress_error <= 3 && duration < 1800000) {
                window.setTimeout(getProgress, 5000);
            } else {
                if (connection_aborted_by_user) {
                    connectionInterrupted('getProgress: aborted by user');
                    return;
                } else if (connection_timeout) {
                    connection_timeout = false;
                    connectionInterrupted('getProgress: timeout');
                    return;
                } else if (xmlhttpProgress.status == 0) {
                    connectionInterrupted('getProgress: status = 0');
                    return;
                } else {
                    connectionInterrupted('getProgress: parse error (status: ' + xmlhttpProgress.status + '): ' + xmlhttpProgress.responseText);
                    return;
                }
            }
        }
    }
}

function back() {
    window.clearTimeout(download_link_timer);
    window.clearInterval(url_change_timer);
    hide_all_windows();
    document.getElementById('main_window').style.display = 'block';
    show_advertising_horizontal_box(true);
    refresh_ads();
}

function convert_more_files() {
    back();
    delete_all_files();
}

function hide_all_windows() {
    document.getElementById('main_window').style.display = 'none';
    document.getElementById('completed_window').style.display = 'none';
    document.getElementById('error_window').style.display = 'none';
    document.getElementById('alert_window').style.display = 'none';
    document.getElementById('progress_window').style.display = 'none';
    document.getElementById('progress_note').style.display = 'none';
}

function changeWaitImage() {
    document.getElementById('img_wait_1').src = '/images/9.6.0/gears.gif';
    document.getElementById('img_wait_2').src = '/images/9.6.0/gears.gif';
}

function pw_input() {
    if (document.forms['form1'].sec_read.checked == true) {
        document.getElementById('span_pw_input').style.display = 'block';
        document.forms[0].elements['sec_pw'].focus();
    } else {
        document.getElementById('span_pw_input').style.display = 'none';
    }
}
var motion_element_id = null;
var motion_element_offset = 0;
var motion_element_nextSibling = null;
var motion_element_previousPosition = 0;
var motion_element_direction = 'down';

function start_motion(file_id) {
    tooltip_activated = false;
    tooltip(null, null);
    motion_element_id = file_id;
    var motion_element = document.getElementById('div_file_box' + motion_element_id);
    var start_point = document.getElementById('files');
    motion_element_offset = motion_element.offsetTop;
    motion_element.style.zIndex = 10;
    motion_element_nextSibling = motion_element.nextSibling;
}

function mouseMove(e) {
    if (!e) {
        e = window.event;
    }
    if (motion_element_id != null) {
        var motion_element = document.getElementById('div_file_box' + motion_element_id);
        var left = 0;
        var top = 0;
        var pos_y;
        var start_point = document.getElementById('files');
        var obj = start_point;
        if (obj.offsetParent) {
            do {
                left += obj.offsetLeft;
                top += obj.offsetTop;
            } while (obj = obj.offsetParent);
        }
        var scrolled = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        pos_y = e.clientY ? (e.clientY + scrolled - top) : e.pageY - top;
        if (pos_y > 10 && pos_y < (start_point.offsetHeight - 10)) {
            motion_element_direction = (pos_y > motion_element_previousPosition) ? 'down' : 'up';
            motion_element_previousPosition = pos_y;
            pos_y = pos_y - 20 - motion_element_offset;
            motion_element.style.top = pos_y + 'px';
            order_elements();
        }
        return false;
    }
    return true;
}

function order_elements() {
    var motion_element = document.getElementById('div_file_box' + motion_element_id);
    var root = document.getElementById('files');
    var nodes = root.childNodes;
    var node = null;
    var scope = (motion_element_direction == 'down') ? motion_element.offsetHeight : 0;
    var factor = (motion_element_direction == 'down') ? 0.55 : 0.45;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType == 1 && nodes[i].id != null && nodes[i] != motion_element) {
            if (nodes[i].offsetTop + (nodes[i].offsetHeight * factor) > motion_element.offsetTop + scope) {
                node = nodes[i];
                i = nodes.length;
            }
        }
    }
    if (node == null && full == false) {
        node = root.lastChild;
    }
    if (motion_element_nextSibling != node) {
        var old_offset = motion_element.offsetTop;
        root.insertBefore(motion_element, node);
        motion_element.style.top = '0px';
        motion_element_offset = motion_element.offsetTop;
        motion_element.style.top = (old_offset - motion_element_offset) + 'px';
        motion_element_nextSibling = motion_element.nextSibling;
    }
    hide_input_fields();
}

function show_input_field(element, file_box, change_element, onmouseover_class, onmouseout_class) {
    if (Number.isInteger !== undefined) {
        return;
    }
    var left = 0;
    var top = 0;
    var obj = element;
    if (obj.offsetParent) {
        do {
            left += obj.offsetLeft;
            top += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    var input_field = document.getElementById('div_file_box' + file_box);
    input_field.style.top = top + 'px';
    input_field.style.left = left + 'px';
    input_field.style.width = element.offsetWidth + 'px';
    input_field.style.height = element.offsetHeight + 'px';
    input_field.style.display = 'inline';
    if (change_element == true) {
        input_field.onmouseover = function() {
            highlight_group(file_box, true);
            tooltip(get_tooltip_change(file_box), this);
            element.className = onmouseover_class;
        };
        input_field.onmouseout = function() {
            highlight_group(file_box, false);
            tooltip(null, null);
            element.className = onmouseout_class;
        };
    } else {
        input_field.onmouseover = function() {
            element.className = onmouseover_class;
        };
        input_field.onmouseout = function() {
            element.className = onmouseout_class;
        };
    }
    var input_child = input_field.firstChild;
    input_child.style.right = (input_child.offsetWidth - 10 - element.offsetWidth) + 'px';
    input_child.style.top = -10 + 'px';
}

function hide_input_fields() {
    var input_fields = document.getElementById('files_input').childNodes;
    for (var i = 0; i < input_fields.length; i++) {
        input_fields[i].style.display = 'none';
    }
}

function mouseUp() {
    if (motion_element_id != null) {
        tooltip_activated = true;
        var motion_element = document.getElementById('div_file_box' + motion_element_id);
        motion_element.style.top = '0px';
        motion_element.style.zIndex = 0;
        motion_element_id = null;
        renumber();
    }
}

function tooltip(text, element) {
    tooltip_window = document.getElementById('tooltip');
    if (text == null) {
        tooltip_window.style.display = 'none';
    } else if (tooltip_activated == true) {
        if (window.innerWidth != undefined && window.innerWidth < 600) {
            return;
        }
        tooltip_window.style.display = 'block';
        document.getElementById('tooltip_text').innerHTML = text;
        var offsetX = 0;
        var offsetY = 0;
        if (element == null) {
            element = document.getElementById('files');
            offsetX = -120;
            offsetY = 10;
        }
        var left = 0;
        var top = 0;
        var obj = element;
        if (obj.offsetParent) {
            do {
                left += obj.offsetLeft;
                top += obj.offsetTop;
            } while (obj = obj.offsetParent);
        }
        tooltip_window.style.top = (top - tooltip_window.offsetHeight + offsetY) + 'px';
        tooltip_window.style.left = (left - (tooltip_window.offsetWidth / 2) + (element.offsetWidth / 2) + offsetX) + 'px';
    }
}

function display_page_numbering(element) {
    page_numbering_field = element;
    var box = document.getElementById('page_numbering');
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    box.innerHTML = '<div style="font-weight: bold; padding: 5px; color: #FFFFFF; background-color: #444444; border-bottom: 1px solid #AAAAAA">Templates:</div><div onclick="insert_page_numbering(this)" onmouseover="page_numbering_mouseover(this)" onmouseout="page_numbering_mouseout(this)" class="page_numbering_sample">Page (x) of (y)</div><div onclick="insert_page_numbering(this)" onmouseover="page_numbering_mouseover(this)" onmouseout="page_numbering_mouseout(this)" class="page_numbering_sample">(x) of (y)</div><div onclick="insert_page_numbering(this)" onmouseover="page_numbering_mouseover(this)" onmouseout="page_numbering_mouseout(this)" class="page_numbering_sample">Page (x)</div><div onclick="insert_page_numbering(this)" onmouseover="page_numbering_mouseover(this)" onmouseout="page_numbering_mouseout(this)" class="page_numbering_sample">(x)</div><div onclick="insert_page_numbering(this)" onmouseover="page_numbering_mouseover(this)" onmouseout="page_numbering_mouseout(this)" class="page_numbering_sample">(file)</div><div onclick="insert_page_numbering(this)" onmouseover="page_numbering_mouseover(this)" onmouseout="page_numbering_mouseout(this)" class="page_numbering_sample">(file).(ext)</div><div onclick="insert_page_numbering(this)" onmouseover="page_numbering_mouseover(this)" onmouseout="page_numbering_mouseout(this)" class="page_numbering_sample">' + date.toLocaleDateString() + '</div><div onclick="insert_page_numbering(this)" onmouseover="page_numbering_mouseover(this)" onmouseout="page_numbering_mouseout(this)" class="page_numbering_sample">' + date.toLocaleString() + '</div><div onclick="insert_page_numbering(this)" onmouseover="page_numbering_mouseover(this)" onmouseout="page_numbering_mouseout(this)" class="page_numbering_sample">' + year + '/' + month + '/' + day + '</div><div onclick="insert_page_numbering(this)" onmouseover="page_numbering_mouseover(this)" onmouseout="page_numbering_mouseout(this)" class="page_numbering_sample">' + year + '-' + month + '-' + day + '</div>';
    var left = 0;
    var top = 0;
    var obj = element;
    if (obj.offsetParent) {
        do {
            left += obj.offsetLeft;
            top += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    top += element.offsetHeight;
    box.style.display = 'block';
    box.style.width = (element.offsetWidth - 2 + 20) + 'px';
    box.style.top = top + 'px';
    box.style.left = left + 'px';
}

function hide_page_numbering() {
    if (page_numbering_active == false) {
        var box = document.getElementById('page_numbering');
        box.style.display = 'none';
    }
}

function page_numbering_mouseover(element) {
    page_numbering_active = true;
    element.style.backgroundColor = '#828282';
    element.style.color = '#FFFFFF';
}

function page_numbering_mouseout(element) {
    page_numbering_active = false;
    element.style.backgroundColor = 'transparent';
    element.style.color = '#000000';
}

function insert_page_numbering(node) {
    page_numbering_field.value = node.firstChild.data;
    page_numbering_active = false;
    page_numbering_field = null;
    hide_page_numbering();
}

function overlap_edges_changed(value) {
    var nodes = document.getElementsByTagName('div');
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.className == 'overlap_edge') {
            if (value.checked == 1) {
                node.style.visibility = 'visible';
                document.getElementById('overlap_edges_options').className = 'overlap_edges_options';
            } else {
                node.style.visibility = 'hidden';
                document.getElementById('overlap_edges_options').className = 'overlap_edges_options only_big_screen';
            }
        }
    }
}

function preload() {
    img = new Array();
    for (var i = 0; i < preload.arguments.length; i++) {
        img[i] = new Image();
        img[i].src = preload.arguments[i];
    }
}

function convert_to_array(element) {
    if (element instanceof Array == false) {
        element = [element];
    }
    return element;
}

function feedback_solution(type_ids, problem_ids, solution_ids) {
    type_ids = convert_to_array(type_ids);
    problem_ids = convert_to_array(problem_ids);
    solution_ids = convert_to_array(solution_ids);
    var solutions = document.getElementById('solutions');
    var conversion_type = document.forms[0].elements['conversion_type'];
    var conversion_problem = document.forms[0].elements['conversion_problem'];
    for (var i = 0; i < type_ids.length; i++) {
        for (var j = 0; j < problem_ids.length; j++) {
            for (var k = 0; k < solution_ids.length; k++) {
                var type_id = type_ids[i];
                var problem_id = problem_ids[j];
                var solution_id = solution_ids[k];
                if ((type_id == '' || conversion_type.value == type_id) && (problem_id == '' || conversion_problem.value == problem_id)) {
                    document.getElementById('solution_' + solution_id).style.display = 'block';
                    solutions.style.display = 'block';
                }
            }
        }
    }
}

function check_email(email) {
    email = email.replace(/^\s+|\s+$/gm, '');
    if (email.length < 6) {
        return false;
    }
    if (email.indexOf('@') == -1 || email.indexOf(' ') != -1 || email.indexOf(',') != -1) {
        return false;
    }
    return true;
}

function feedback_change(submit) {
    if (submit == undefined) {
        submit = false;
    }
    var rating = document.forms[0].elements['rating'];
    if (rating != undefined) {
        var comment = document.forms[0].elements['comment'];
        var mail = document.forms[0].elements['mail'];
        var conversion_type_text = document.forms[0].elements['conversion_type_text'];
        var conversion_problem_text = document.forms[0].elements['conversion_problem_text'];
        var comment_title = document.getElementById('comment_title');
        var bug_report_title = document.getElementById('bug_report_title');
        var comment_optional = document.getElementById('comment_optional');
        var mail_optional = document.getElementById('mail_optional');
        var error = document.getElementById('feedback_error');
        var solutions = document.getElementById('solutions');
        var solutions_container = document.getElementById('solutions_container');
        var conversion_type = document.forms[0].elements['conversion_type'];
        var conversion_problem = document.forms[0].elements['conversion_problem'];
        error.style.display = 'none';
        for (var i = 0; i < solutions_container.childNodes.length; i++) {
            var solution = solutions_container.childNodes[i];
            if (solution.nodeType == 1) {
                solution.style.display = 'none';
            }
        }
        solutions.style.display = 'none';
        feedback_solution('', '10', '1');
        feedback_solution([1, 2, 3, 4, 5], [11, 12], [2]);
        feedback_solution([2], [11, 12], [3, 4]);
        feedback_solution([11], [11, 12], [5, 6, 7, 9, 24]);
        feedback_solution([12], [11, 12], [5, 8, 9, 10, 24]);
        feedback_solution([13, 14], [11, 12], [5, 7, 9, 24]);
        feedback_solution([15], [11, 12], [9]);
        feedback_solution([16], [11, 12], [6, 7, 9, 24]);
        feedback_solution([17], [11, 12], [8, 9, 10, 24]);
        feedback_solution([18, 19], [11, 12], [7, 9, 24]);
        feedback_solution('', '6', '11');
        feedback_solution('', '8', '12');
        feedback_solution('', '3', '13');
        feedback_solution('', '1', '13');
        feedback_solution('', '5', '14');
        feedback_solution('', '7', '14');
        feedback_solution('', '9', '15');
        feedback_solution('', '2', '16');
        feedback_solution('', '4', '17');
        feedback_solution('', '5', '22');
        feedback_solution([1, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], [11, 12], [18]);
        feedback_solution('21', '12', '23');
        feedback_solution('23', '5', '19');
        feedback_solution('28', [11, 12], '20');
        feedback_solution('32', '', '21');
        if (rating[4].checked || rating[5].checked) {
            comment_title.style.display = 'none';
            bug_report_title.style.display = 'block';
            mail_optional.style.display = 'none';
        } else {
            comment_title.style.display = 'block';
            bug_report_title.style.display = 'none';
            mail_optional.style.display = 'inline';
        }
        if ((rating[4].checked || rating[5].checked) && comment.value.length < 40) {
            document.forms[0].elements['comment'].style.border = '2px solid #AA0000';
            if (submit) {
                error.style.display = 'block';
                error.innerHTML = 'Please describe your problem in more detail.';
                return false;
            }
        } else {
            document.forms[0].elements['comment'].style.border = '2px solid #999999';
        }
        if ((rating[4].checked || rating[5].checked) && mail.value == '') {
            mail.style.border = '2px solid #AA0000';
            if (submit) {
                error.style.display = 'block';
                error.innerHTML = 'Please enter your email address so that I can contact you.';
                return false;
            }
        } else if (mail.value != '' && check_email(mail.value) == false) {
            mail.style.border = '2px solid #AA0000';
            if (submit) {
                error.style.display = 'block';
                error.innerHTML = 'Your entered email address is invalid.';
                return false;
            }
        } else {
            mail.style.border = '2px solid #999999';
        }
        if ((rating[4].checked || rating[5].checked) && conversion_type.value == '') {
            conversion_type.style.border = '2px solid #AA0000';
            if (submit) {
                error.style.display = 'block';
                error.innerHTML = 'Please select above which type of conversion you would like to do exactly.';
                return false;
            }
        } else {
            conversion_type.style.border = '1px solid #999999';
        }
        if ((rating[4].checked || rating[5].checked) && conversion_problem.value == '') {
            conversion_problem.style.border = '2px solid #AA0000';
            if (submit) {
                error.style.display = 'block';
                error.innerHTML = 'Please select above where a problem occurs.';
                return false;
            }
        } else {
            conversion_problem.style.border = '1px solid #999999';
        }
    }
    if (submit && !rating[0].checked && !rating[1].checked && !rating[2].checked && !rating[3].checked && !rating[4].checked && !rating[5].checked) {
        error.style.display = 'block';
        error.innerHTML = 'Please choose an evaluation.';
        return false;
    }
    if (rating[4].checked || rating[5].checked) {
        conversion_type_text.value = conversion_type.options[conversion_type.selectedIndex].text;
        conversion_problem_text.value = conversion_problem.options[conversion_problem.selectedIndex].text;
    }
    return true;
}

function faq_mark_id() {
    var url_split = window.location.href.split('#');
    var faq_id = url_split[url_split.length - 1];
    var element = document.getElementById(faq_id);
    if (element) {
        element.style.border = '3px solid #AA0000';
    }
    window.scrollBy(0, -20);
}

function preferences_element_over(id) {
    if (current_pref_element != id) {
        var pref_menu_element = document.getElementById('pref_menu_element_' + id);
        pref_menu_element.style.backgroundColor = '#FFFFFF';
        pref_menu_element.style.borderColor = '#666666';
        pref_menu_element.style.color = '#000000'
    }
}

function preferences_element_out(id) {
    if (current_pref_element != id) {
        var pref_menu_element = document.getElementById('pref_menu_element_' + id);
        pref_menu_element.style.backgroundColor = '#FAFAFA';
        pref_menu_element.style.borderColor = '#CCCCCC';
        pref_menu_element.style.color = '#666666'
    }
}

function preferences_element_deactivate(id) {
    var last_pref_element = document.getElementById('pref_element_' + id);
    preferences_element_out(id);
    element_hide('pref_element_' + id);
}

function preferences_element_activate(id) {
    var last_pref_element_id = current_pref_element;
    if (id == last_pref_element_id) {
        current_pref_element = 0;
        preferences_element_deactivate(last_pref_element_id);
        if (old_browser == false) {
            for (var i = 1; i <= 7; i++) {
                document.getElementById('pref_menu_element_' + i).style.borderRadius = '5px';
            }
        }
    } else {
        var pref_menu_element = document.getElementById('pref_menu_element_' + id);
        pref_menu_element.style.backgroundColor = '#ac1b1b';
        pref_menu_element.style.borderColor = '#333333';
        pref_menu_element.style.color = '#FFFFFF';
        current_pref_element = id;
        var pref_element = document.getElementById('pref_element_' + id);
        if (last_pref_element_id != 0) {
            preferences_element_deactivate(last_pref_element_id);
        }
        if (old_browser == false) {
            for (var i = 1; i <= 7; i++) {
                document.getElementById('pref_menu_element_' + i).style.borderRadius = '5px 5px 0px 0px';
            }
        }
        element_fadein('pref_element_' + id);
    }
}

function preferences_menu_show(id) {
    document.getElementById('pref_menu_element_' + id).style.display = 'block';
}

function preferences_menu_hide(id) {
    document.getElementById('pref_menu_element_' + id).style.display = 'none';
    if (current_pref_element == id) {
        preferences_element_activate(id);
    }
}

function drag(e) {
    e.stopPropagation();
    e.preventDefault();
}

function drop(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0 && window.FormData) {
        var files = [];
        for (var i = 0; i < e.dataTransfer.files.length; i++) {
            var file_object = {
                'name': e.dataTransfer.files[i].name,
                'file_object': e.dataTransfer.files[i]
            };
            files.push(file_object);
        }
        files.sort(filesSort);
        for (var i = 0; i < files.length; i++) {
            add_file(number_next, [files[i]['file_object']]);
        }
    }
}

function filesSort(a, b) {
    if (a['name'].toUpperCase() < b['name'].toUpperCase()) {
        return -1;
    }
    return 1;
}

function html5_support() {
    if (window.FormData) {
        return true;
    }
    return false;
}

function frame_load() {
    if (running == true) {
        frame_load_checker = window.setTimeout(function() {
            connectionInterrupted('frame_load - timeout', true)
        }, 5000);
    }
}

function frame_load_listener(bool) {
    var frame = document.getElementById('upload_frame');
    running = bool;
    if (bool) {
        if (frame.attachEvent) {
            frame.attachEvent('onload', frame_load);
        } else if (frame.addEventListener) {
            frame.addEventListener('load', frame_load, false);
        } else {
            frame.onload = frame_load;
        }
    } else {
        window.clearTimeout(frame_load_checker);
        if (frame.attachEvent) {
            frame.attachEvent('onload', null);
        } else if (frame.addEventListener) {
            frame.addEventListener('load', null, false);
        } else {
            frame.onload = null;
        }
    }
}

function disable_language_msg() {
    sendLog('disable_language_msg');
    var language_msg = document.getElementById('language_msg');
    if (language_msg != undefined) {
        language_msg.style.display = 'none';
    }
}

function disable_privacy_msg() {
    sendLog('disable_privacy_msg');
    var privacy_msg = document.getElementById('privacy_msg');
    if (privacy_msg != undefined) {
        privacy_msg.style.display = 'none';
    }
}

function disable_cookie_msg() {
    var cookie_msg = document.getElementById('cookie_msg');
    if (cookie_msg != undefined) {
        cookie_msg.style.display = 'none';
    }
}

function unload_site() {
    connection_aborted_by_user = true;
}

function preferences_image_page_size_changed() {
    if (document.forms[0].elements['image_page_size'].value == 'image_size') {
        document.forms[0].elements['image_page_orientation'].value = 'auto';
        document.forms[0].elements['image_page_orientation'].disabled = true;
    } else {
        document.forms[0].elements['image_page_orientation'].disabled = false;
    }
    if (document.forms[0].elements['image_page_size'].value == 'custom') {
        element_fadein('image_page_size_custom_box', 'inline-block');
        document.forms[0].elements['image_page_size'].style.width = '135px';
    } else {
        element_hide('image_page_size_custom_box');
        document.forms[0].elements['image_page_size'].style.width = '';
    }
    generateSelectBoxes();
}

function preferences_image_content_size_changed() {
    if (document.forms[0].elements['image_content_size'].value == 'custom') {
        element_fadein('image_content_size_custom_box');
        element_fadein('preferences_image_content_position_content');
        element_hide('preferences_image_outer_margin_content');
    } else {
        element_hide('image_content_size_custom_box');
        element_hide('preferences_image_content_position_content');
        element_fadein('preferences_image_outer_margin_content');
    }
}

function preferences_image_content_size_unit_changed() {
    if (document.forms[0].elements['image_content_size_unit'].value == '%') {
        element_fadein('image_content_size_unit_relative', 'inline-block');
        element_hide('image_content_size_unit_absolute');
    } else {
        element_fadein('image_content_size_unit_absolute', 'inline-block');
        element_hide('image_content_size_unit_relative');
    }
}

function preferences_image_content_position_horizontal_changed() {
    if (document.forms[0].elements['image_content_position_horizontal'].value == 'middle') {
        element_hide('image_content_position_horizontal_options');
    } else {
        element_fadein('image_content_position_horizontal_options', 'inline');
    }
}

function preferences_image_content_position_vertical_changed() {
    if (document.forms[0].elements['image_content_position_vertical'].value == 'middle') {
        element_hide('image_content_position_vertical_options');
    } else {
        element_fadein('image_content_position_vertical_options', 'inline');
    }
}

function preferences_image_layout_mode_changed() {
    if (document.forms[0].elements['image_layout_mode'].value == '1') {
        element_hide('preferences_image_inner_margin_content');
        preferences_image_content_size_changed();
        document.forms[0].elements['image_outer_margin'].value = '0';
        element_fadein('preferences_image_content_size_content');
    } else {
        element_fadein('preferences_image_inner_margin_content');
        element_fadein('preferences_image_outer_margin_content');
        document.forms[0].elements['image_outer_margin'].value = '15';
        document.forms[0].elements['layout_mode_group'].value = '0';
        preferences_layout_mode_changed();
        element_hide('preferences_image_content_size_content');
        element_hide('preferences_image_content_position_content');
    }
    generateSelectBoxes();
}

function element_hide(option) {
    document.getElementById(option).style.display = 'none';
    document.getElementById(option).style.animation = '';
    document.getElementById(option).style.MozAnimation = '';
    document.getElementById(option).style.WebkitAnimation = '';
}

function element_fadein(option, type) {
    if (type == undefined) {
        type = 'block';
    }
    document.getElementById(option).style.display = type;
    document.getElementById(option).style.animation = 'fadein 1s';
    document.getElementById(option).style.MozAnimation = 'fadein 1s';
    document.getElementById(option).style.WebkitAnimation = 'fadein 1s';
}

function preferences_layout_direction_changed(animation) {
    var border = document.forms[0].elements['layout_border'].checked;
    var mode = document.forms[0].elements['layout_mode'].value;
    var direction_mode_1 = document.forms[0].elements['layout_direction_mode_1'].value;
    var direction_x = document.forms[0].elements['layout_direction_x'].value;
    var direction_mode_2 = document.forms[0].elements['layout_direction_mode_2'].value;
    if (mode == '0') {
        return;
    }
    var direction = '';
    element_hide('preferences_layout_direction_x');
    element_hide('preferences_layout_direction_mode_1');
    element_hide('preferences_layout_direction_mode_2');
    if (mode == -2) {
        element_fadein('preferences_layout_direction_mode_2', 'inline-block');
    }
    if (mode >= 2 || mode <= -3 || (mode == -2 && direction_mode_2 == 'continuous')) {
        element_fadein('preferences_layout_direction_x', 'inline-block');
    }
    if (mode >= 4 || mode <= -4) {
        element_fadein('preferences_layout_direction_mode_1', 'inline-block');
    }
    element_hide('preferences_layout_mode_multiple_pages_image');
    element_hide('preferences_layout_mode_booklet_split_image');
    element_hide('preferences_layout_mode_image');
    document.forms[0].elements['layout_direction_mode'].value = direction_mode_1;
    if (mode == '-2' && direction_mode_2 == 'booklet') {
        element_fadein('preferences_layout_mode_booklet_split_image');
        document.forms[0].elements['layout_direction_mode'].value = 'booklet';
    } else {
        element_fadein('preferences_layout_mode_multiple_pages_image');
        switch (mode) {
            case '4':
            case '9':
            case '-4':
            case '-9':
                direction = direction_mode_1 + '_' + direction_x;
            case '1':
            case 'booklet_left_right':
            case 'booklet_right':
                document.getElementById('preferences_layout_mode_multiple_pages_image').innerHTML = '<div>' + generate_layout_mode_image(mode, border, 100, 66, direction, animation) + '</div>';
                break;
            default:
                document.getElementById('preferences_layout_mode_multiple_pages_image').innerHTML = '<table><tr><td>' + generate_layout_mode_image(mode, border, 100, 66, direction_mode_1 + '_' + direction_x, animation) + '</td><td style="text-align: center; vertical-align: middle; font-weight: bold; padding: 0px 10px">or</td><td>' + generate_layout_mode_image(mode, border, 55, 66, direction_mode_1 + '_' + direction_x, animation) + '</td></tr></table> ';
        }
    }
}

function preferences_layout_mode_changed() {
    var group = document.forms[0].elements['layout_mode_group'].value;
    document.getElementById('preferences_layout_outer_margin_info').style.display = 'none';
    document.getElementById('preferences_layout_inner_margin_info').style.display = 'none';
    element_hide('preferences_layout_border');
    element_hide('preferences_layout_printer_mode');
    var value = '0';
    element_hide('preferences_layout_mode_multiple_pages_per_sheet');
    element_hide('preferences_layout_mode_booklet');
    element_hide('preferences_layout_mode_cut_pages');
    element_hide('preferences_layout_direction_content');
    element_hide('preferences_layout_direction_desc_1');
    element_hide('preferences_layout_direction_desc_2');
    if (group == 'multiple_pages_per_sheet') {
        element_fadein('preferences_layout_mode_multiple_pages_per_sheet', 'inline-block');
        element_fadein('preferences_layout_direction_content');
        element_fadein('preferences_layout_direction_desc_1');
        value = document.forms[0].elements['layout_mode_multiple_pages_per_sheet'].value;
    } else if (group == 'booklet') {
        element_fadein('preferences_layout_mode_booklet', 'inline-block');
        value = document.forms[0].elements['layout_mode_booklet'].value;
    } else if (group == 'cut_pages') {
        element_fadein('preferences_layout_mode_cut_pages', 'inline-block');
        element_fadein('preferences_layout_direction_content');
        element_fadein('preferences_layout_direction_desc_2');
        value = document.forms[0].elements['layout_mode_cut_pages'].value;
    } else {
        value = group;
    }
    document.forms[0].elements['layout_mode'].value = value;
    element_hide('preferences_layout_mode_multiple_pages_image');
    element_hide('preferences_layout_mode_booklet_split_image');
    element_hide('preferences_layout_mode_image');
    if (value == '0') {
        element_fadein('preferences_layout_mode_image');
    } else {
        element_fadein('preferences_layout_mode_multiple_pages_image');
        var border = document.forms[0].elements['layout_border'].checked;
        var multiple_rows = false;
        switch (value) {
            case '4':
            case '-4':
            case '6':
            case '-6':
            case '8':
            case '-8':
            case '9':
            case '-9':
                multiple_rows = true;
        }
        document.getElementById('preferences_layout_inner_margin_image').style.background = 'url(\'/images/9.6.0/preferences/layout_inner_margin' + (multiple_rows ? '' : '_2_pages') + '_icon.png\')';
    }
    if (value == '0') {
        element_hide('preferences_layout_page_content');
        element_hide('preferences_layout_outer_margin_content');
        element_hide('preferences_layout_inner_margin_content');
        element_hide('preferences_layout_content_size_content');
        element_hide('preferences_layout_content_position_content');
        document.forms[0].elements['layout_outer_margin'].value = '0';
    } else if (value == '1') {
        element_fadein('preferences_layout_page_content');
        element_fadein('preferences_layout_outer_margin_content');
        element_hide('preferences_layout_inner_margin_content');
        element_fadein('preferences_layout_content_size_content');
        document.forms[0].elements['layout_outer_margin'].value = '0';
        preferences_layout_content_size_changed();
    } else if (value == 'booklet_left_right' || value == 'booklet_right') {
        element_fadein('preferences_layout_page_content');
        element_fadein('preferences_layout_outer_margin_content');
        element_fadein('preferences_layout_inner_margin_content');
        element_hide('preferences_layout_content_size_content');
        element_hide('preferences_layout_content_position_content');
        document.forms[0].elements['layout_inner_margin'].value = '0';
        document.forms[0].elements['layout_outer_margin'].value = '0';
        element_fadein('preferences_layout_printer_mode', 'block');
    } else {
        element_fadein('preferences_layout_page_content');
        element_fadein('preferences_layout_outer_margin_content');
        element_fadein('preferences_layout_inner_margin_content');
        element_hide('preferences_layout_content_size_content');
        element_hide('preferences_layout_content_position_content');
        if (value > 1) {
            element_fadein('preferences_layout_border', 'inline-block');
            document.forms[0].elements['layout_inner_margin'].value = '5';
            document.forms[0].elements['layout_outer_margin'].value = '15';
        } else {
            document.getElementById('preferences_layout_outer_margin_info').style.display = 'inline';
            document.getElementById('preferences_layout_inner_margin_info').style.display = 'inline';
            document.forms[0].elements['layout_inner_margin'].value = '0';
            if (value >= -3) {
                document.forms[0].elements['layout_outer_margin'].value = '0';
            } else {
                document.forms[0].elements['layout_outer_margin'].value = '10';
            }
        }
    }
    preferences_layout_direction_changed(false);
}

function preferences_layout_printer_mode_changed() {
    element_hide('preferences_layout_printer_mode_img');
    element_hide('preferences_layout_printer_mode_paperfeed_front_img');
    element_hide('preferences_layout_printer_mode_paperfeed_back_img');
    if (document.forms[0].elements['layout_printer_mode'].value == 'duplex' || document.forms[0].elements['layout_printer_mode'].value == 'duplex_short_edge') {
        element_fadein('preferences_layout_printer_mode_img')
    } else if (document.forms[0].elements['layout_printer_mode'].value == 'paperfeed_front') {
        element_fadein('preferences_layout_printer_mode_paperfeed_front_img');
    } else if (document.forms[0].elements['layout_printer_mode'].value == 'paperfeed_back') {
        element_fadein('preferences_layout_printer_mode_paperfeed_back_img');
    }
}

function generate_layout_mode_image(mode, border, width, height, numbering_type, animation) {
    var rows = 1;
    var columns = 1;
    var skip_first_column = false;
    var outer_margin = 5;
    var inner_margin = 3;
    var split_layout = false;
    var font_size = 16;
    if (mode == '2' || mode == '-2') {
        rows = 1;
        columns = 2;
    } else if (mode == '3' || mode == '-3') {
        rows = 1;
        columns = 3;
    } else if (mode == '4' || mode == '-4') {
        rows = 2;
        columns = 2;
    } else if (mode == '6' || mode == '-6') {
        rows = 2;
        columns = 3;
    } else if (mode == '8' || mode == '-8') {
        rows = 2;
        columns = 4;
    } else if (mode == '9' || mode == '-9') {
        rows = 3;
        columns = 3;
    } else if (mode == 'booklet_left_right') {
        rows = 1;
        columns = 2;
        outer_margin = 0;
        inner_margin = 1;
        border = true;
    } else if (mode == 'booklet_right') {
        rows = 1;
        columns = 2;
        skip_first_column = true;
        outer_margin = 0;
        inner_margin = 1;
        border = true;
    } else {
        border = true;
    }
    if (mode.charAt(0) == '-') {
        split_layout = true;
        outer_margin = 0;
        inner_margin = 5;
        border = false;
    }
    if (width < height) {
        var temp;
        temp = rows;
        rows = columns;
        columns = temp;
        if (rows == 4) {
            font_size = 10;
            outer_margin = 1;
            inner_margin = 1;
        } else if (rows == 3) {
            font_size = 12;
            outer_margin = 1;
            inner_margin = 1;
        } else if (columns == 2) {
            outer_margin = 1;
            inner_margin = 1;
        }
    } else {
        if (rows == 3 || columns == 4) {
            font_size = 12;
            outer_margin = 2;
            inner_margin = 2;
        }
    }
    var image = '<div style="width: ' + width + 'px; height: ' + height + 'px; border: 1px solid #999999; background-color: #FFFFFF; box-shadow: 2px 2px 2px #999999; padding: ' + outer_margin + 'px; box-sizing: border-box; border-radius: 3px"><table style="width: 100%; height: 100%;">';
    for (var i = 0; i < rows; i++) {
        image += '<tr style="">';
        var border_bottom = '';
        if (split_layout && (i + 1) < rows) {
            border_bottom = 'border-bottom: 2px dotted #FF0000;';
        }
        for (var j = 0; j < columns; j++) {
            var border_right = '';
            if (split_layout && (j + 1) < columns) {
                border_right = 'border-right: 2px dotted #FF0000;';
            }
            image += '<td style="padding: ' + inner_margin + 'px; width: ' + (100 / columns) + '%; height: ' + (100 / rows) + '%; ' + border_bottom + border_right + '; ' + (animation ? 'animation: fadein 1s;' : '') + '">';
            if (!skip_first_column || j > 0) {
                var number = '';
                switch (numbering_type) {
                    case 'row_left_right':
                        number = (j + 1) + (i * columns);
                        break;
                    case 'row_right_left':
                        number = (columns - j) + (i * columns);
                        break;
                    case 'column_left_right':
                        number = (i + 1) + (j * rows);
                        break;
                    case 'column_right_left':
                        number = (i + 1) + ((columns - j - 1) * rows);
                        break;
                }
                image += '<table style="width: 100%; height: 100%; border: ' + (border ? 1 : 0) + 'px solid #777777; background-color: #FFFFFF; background: linear-gradient(#EEEEEE, #AAAAAA); box-sizing: border-box;"><tr><td style="text-align: center; vertical-align: middle; color: #AA0000; font-weight: bold; font-size: ' + font_size + 'px; line-height: 1em;  ">' + number + '</td></tr></table>';
            }
            image += '</td>';
        }
        image += '</tr>';
    }
    image += '</table></div>';
    return image;
}

function preferences_layout_page_size_changed() {
    if (document.forms[0].elements['layout_page_size'].value == 'original_size') {
        document.forms[0].elements['layout_page_orientation'].value = 'auto';
        document.forms[0].elements['layout_page_orientation'].disabled = true;
    } else {
        document.forms[0].elements['layout_page_orientation'].disabled = false;
    }
    if (document.forms[0].elements['layout_page_size'].value == 'custom') {
        element_fadein('layout_page_size_custom_box', 'inline-block');
        document.forms[0].elements['layout_page_size'].style.width = '135px';
    } else {
        element_hide('layout_page_size_custom_box');
        document.forms[0].elements['layout_page_size'].style.width = '';
    }
    generateSelectBoxes();
}

function preferences_layout_content_size_changed() {
    if (document.forms[0].elements['layout_content_size'].value == 'custom') {
        element_fadein('layout_content_size_custom_box');
        element_fadein('preferences_layout_content_position_content');
        element_hide('preferences_layout_outer_margin_content');
    } else {
        element_hide('layout_content_size_custom_box');
        element_hide('preferences_layout_content_position_content');
        element_fadein('preferences_layout_outer_margin_content');
    }
}

function preferences_layout_content_size_unit_changed() {
    if (document.forms[0].elements['layout_content_size_unit'].value == '%') {
        element_fadein('layout_content_size_unit_relative', 'inline-block');
        element_hide('layout_content_size_unit_absolute');
    } else {
        element_fadein('layout_content_size_unit_absolute', 'inline-block');
        element_hide('layout_content_size_unit_relative');
    }
}

function preferences_layout_content_position_horizontal_changed() {
    if (document.forms[0].elements['layout_content_position_horizontal'].value == 'middle') {
        element_hide('layout_content_position_horizontal_options');
    } else {
        element_fadein('layout_content_position_horizontal_options', 'inline');
    }
}

function preferences_layout_content_position_vertical_changed() {
    if (document.forms[0].elements['layout_content_position_vertical'].value == 'middle') {
        element_hide('layout_content_position_vertical_options');
    } else {
        element_fadein('layout_content_position_vertical_options', 'inline');
    }
}

function display_message(text) {
    message_box('Attention!', text);
}

function set_ce0a_blocked_vertical_text(id) {
    var element = document.getElementById(id);
    if (element == null) {
        return;
    }
    element.style.display = 'block';
    element.innerHTML = '<table><tr><td><b>You are using an Ad-Blocker!</b><br><br>This project is funded by advertisements only. To keep Online2PDF.com <b>for free</b> in the future, please <a href="/disable-adblocker" target="_blank">deactivate</a> your Ad-Blocker or support this project by sending a small <a href="/donation" target="_blank">donation</a>.<br><br>Thank you!<br><br><a href="/donation" class="button_donation">Support project with donation</a><br><a href="/disable-adblocker" class="button_adblocker_off">Disable Ad-Blocker</a></td></tr></table>';
}

function set_ce0a_blocked_horizontal_text(id) {
    var element = document.getElementById(id);
    if (element == null) {
        return;
    }
    element.style.display = 'block';
    element.innerHTML = '<table><tr><td><b>You are using an Ad-Blocker!</b><br>This project is funded by advertisements only. To keep Online2PDF.com <b>for free</b> in the future, please <a href="/disable-adblocker" target="_blank">deactivate</a> your Ad-Blocker or support this project by sending a small <a href="/donation" target="_blank">donation</a>. Thank you!</td></tr></table>';
}

function hide_ce0a_blocked_text(id) {
    var element = document.getElementById(id);
    if (element == null) {
        return;
    }
    element.style.display = 'none';
}

function ads_blocked() {
    if (ce0a_blocked('ce0a_vertical') && ce0a_blocked('ce0a_horizontal') && ce0a_blocked('ce0a_mobile')) {
        return true;
    }
    return false;
}

function ce0a_blocked(id) {
    var element = document.getElementById(id);
    if (element == null) {
        return true;
    }
    if (element.offsetWidth > 0 && element.offsetHeight > 0 && element.style.display != 'none' && element.style.visibility != 'hidden' && element.innerHTML != '') {
        return false;
    }
    return true;
}

function adblocker_active() {
    if (adsense_enabled) {
        if (adsense_script_error || (adsense_script_loaded && ads_blocked()) || (document.getElementById('adsense_script') == null)) {
            return true;
        }
    } else {
        if (publift_iframe_error || (publift_iframe_loaded && !publift_site_loaded) || publift_ads_blocked || document.getElementById('publift_iframe') == null) {
            return true;
        }
    }
    return false;
}

function check_script_status() {
    if (adsense_enabled) {
        if (adsense_script_error || adsense_script_loaded || document.getElementById('adsense_script') == null) {
            return true;
        }
    } else {
        if (publift_iframe_error || publift_iframe_loaded || document.getElementById('publift_iframe') == null) {
            return true;
        }
    }
    return false;
}

function ad_space_visible(id) {
    var element = document.getElementById(id);
    if (element == null) {
        return false;
    }
    if ((element.offsetWidth > 0 || element.offsetHeight > 0) && element.style.display != 'none' && element.style.visibility != 'hidden') {
        return true;
    }
    return false;
}

function ce0a_check_check() {
    if (!ce0a_check_status) {
        set_ce0a_blocked_text();
    }
}

function ce0a_check() {
    if (check_script_status()) {
        window.setTimeout(ce0a_check2, 1000);
        window.setTimeout(ce0a_check_check, 2000);
    } else {
        window.setTimeout(ce0a_check, 500);
    }
}

function ce0a_check2() {
    ce0a_check_status = true;
    if (document.getElementById('main_content').offsetWidth == 0) {
        window.setTimeout(ce0a_check2, 5000);
        return;
    }
    if (adblocker_active()) {
        if (adsense_enabled) {
            set_ce0a_blocked_text();
        } else {
            show_ads();
        }
    }
}

function set_ce0a_blocked_text() {
    set_ce0a_blocked_vertical_text('ce0a_blocked_vertical');
    set_ce0a_blocked_horizontal_text('ce0a_blocked_horizontal');
    set_ce0a_blocked_horizontal_text('ce0a_blocked_mobile');
    set_ad_auto_size('ce0a_vertical');
    set_ad_auto_size('ce0a_horizontal');
    set_ad_auto_size('ce0a_mobile');
    if (document.forms[0] != undefined && document.forms[0].elements['ab'] != undefined) {
        document.forms[0].elements['ab'].value = '11';
    }
    window.setTimeout(ce0a_check3, 1000);
}

function set_ad_auto_size(id) {
    var element = document.getElementById(id);
    if (element == null) {
        return;
    }
    element.style.height = 'auto';
}

function ce0a_check3() {
    if (adblocker_active()) {
        window.setTimeout(ce0a_check3, 1000);
    } else {
        hide_ce0a_blocked_text('ce0a_blocked_vertical');
        hide_ce0a_blocked_text('ce0a_blocked_horizontal');
        hide_ce0a_blocked_text('ce0a_blocked_mobile');
        if (document.forms[0] != undefined && document.forms[0].elements['ab'] != undefined) {
            document.forms[0].elements['ab'].value = '10';
        }
    }
}

function refresh_ads() {
    if (adsense_enabled == false) {
        return;
    }
    try {
        var current_time = (new Date()).getTime();
        if (last_ad_refresh < current_time - 90 * 1000) {
            last_ad_refresh = current_time;
            show_ad('ce0a_vertical', true);
            show_ad('ce0a_horizontal', true);
            show_ad('ce0a_mobile', true);
            show_ad('ce0a_rectangle', true);
            ce0a_check();
        }
    } catch (err) {
        console.log(err);
    }
}

function show_ad(id, refresh) {
    if (refresh == undefined) {
        refresh = false;
    }
    var element = document.getElementById(id + '_container');
    if (element == null) {
        return false;
    }
    if (ad_space_visible(id + '_container') && (refresh || element.innerHTML == '')) {
        element.innerHTML = get_ad(id);
        init_ad(id);
        if (id == 'ce0a_vertical_2') {
            ad_title_check('ce0a_title_vertical_2', 'ce0a_vertical_2');
        }
        if (id == 'ce0a_vertical_3') {
            ad_title_check('ce0a_title_vertical_3', 'ce0a_vertical_3');
        }
        return true;
    }
    return false;
}

function show_publift_ad(id) {
    var element_container = document.getElementById(id + '_container');
    if (element_container == null) {
        return false;
    }
    if (ad_space_visible(id + '_container') && element_container.innerHTML == '') {
        element_container.innerHTML = get_publift_ad(id);
        return true;
    } else if (element_container.innerHTML == '') { /*console.log(id + ' not visible');*/ }
    return false;
}

function get_ad(id) {
    switch (id) {
        case 'ce0a_vertical':
            return '<ins class="adsbygoogle ce0a_vertical" id="ce0a_vertical" data-ad-format="vertical"     data-ad-client="ca-pub-8579941665237009" data-ad-channel="6546534381"     data-ad-slot="6797399600" data-full-width-responsive="false"></ins>';
            break;
        case 'ce0a_horizontal':
            return '<ins class="adsbygoogle ce0a_horizontal" id="ce0a_horizontal" style="text-align: center"     data-ad-client="ca-pub-8579941665237009" data-ad-channel="3980080794"     data-ad-slot="8217462507" data-full-width-responsive="false"></ins>';
            break;
        case 'ce0a_mobile':
            return '<ins class="adsbygoogle ce0a_mobile" id="ce0a_mobile" data-ad-client="ca-pub-8579941665237009" data-ad-channel="1008418629" data-ad-slot="4577398102" data-full-width-responsive="false"></ins>';
            break;
        case 'ce0a_rectangle':
            return '<ins class="adsbygoogle ce0a_rectangle" id="ce0a_rectangle"     style="display:block"     data-ad-format="rectangle"     data-ad-client="ca-pub-8579941665237009" data-ad-channel="3634581966"     data-ad-slot="6074269908"></ins>';
            break;
        case 'ce0a_vertical_2':
            return '<ins class="adsbygoogle ce0a_vertical" id="ce0a_vertical_2" style="height: auto"     data-ad-client="ca-pub-8579941665237009" data-ad-channel="4320977679"     data-ad-slot="9694195709"     data-ad-format="rectangle"></ins>';
            break;
        case 'ce0a_vertical_3':
            return '<ins class="adsbygoogle ce0a_vertical" id="ce0a_vertical_3" data-ad-client="ca-pub-8579941665237009" data-ad-channel="2572125194" data-ad-slot="9694195709"></ins>';
            break;
        default:
    }
    return '';
}

function get_publift_ad(id) {
    switch (id) {
        case 'ce0a_vertical':
            return '<div id="ce0a_vertical" class="ce0a_vertical"><iframe src="https://ads.online2pdf.com/vertical" style="width: 100%; height: 100%; border: none" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"></iframe></div>';
            break;
        case 'ce0a_horizontal':
            return '<div id="ce0a_horizontal" class="ce0a_horizontal"><iframe src="https://ads.online2pdf.com/horizontal" style="width: 100%; height: 100%; border: none" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin" onload="publift_iframe_loaded = true" onerror="publift_iframe_error = true" id="publift_iframe"></iframe></div>';
            break;
        case 'ce0a_mobile':
            return '<div id="ce0a_mobile" class="ce0a_mobile"><iframe src="https://ads.online2pdf.com/horizontal_mobile" style="width: 100%; height: 100%; border: none" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"></iframe></div>';
            break;
        case 'ce0a_rectangle':
            return '<div id="ce0a_rectangle" class="ce0a_rectangle"><iframe src="https://ads.online2pdf.com/rectangle" style="width: 100%; height: 100%; border: none" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"></iframe></div>';
            break;
        case 'ce0a_vertical_2':
            return '<div id="ce0a_vertical_2" class="ce0a_vertical"><iframe src="https://ads.online2pdf.com/vertical" style="width: 100%; height: 100%; border: none" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"></iframe></div>';
            break;
        case 'ce0a_vertical_3':
            return '<div id="ce0a_vertical_3" class="ce0a_vertical"><iframe src="https://ads.online2pdf.com/vertical" style="width: 100%; height: 100%; border: none" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"></iframe></div>';
            break;
        default:
    }
    return '';
}

function reset_ad_options(element) {
    element.removeAttribute('data-ad-layout');
    element.removeAttribute('data-ad-layout-key');
}

function show_ads() {
    if (publift_only) {
        return;
    }
    if (!document.getElementById('adsense_script')) {
        var script = document.createElement('script');
        script.setAttribute('async', '');
        script.setAttribute('src', 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8579941665237009');
        script.setAttribute('crossorigin', 'anonymous');
        script.setAttribute('onerror', 'adsense_script_error = true');
        script.setAttribute('onload', 'adsense_script_loaded = true');
        script.setAttribute('id', 'adsense_script');
        document.body.appendChild(script);
    }
    var refresh = !adsense_enabled;
    var new_ad_available = false;
    new_ad_available = show_ad('ce0a_vertical', refresh) || new_ad_available;
    new_ad_available = show_ad('ce0a_horizontal', refresh) || new_ad_available;
    new_ad_available = show_ad('ce0a_mobile', refresh) || new_ad_available;
    new_ad_available = show_ad('ce0a_vertical_2', refresh) || new_ad_available;
    new_ad_available = show_ad('ce0a_vertical_3', refresh) || new_ad_available;
    adsense_enabled = true;
    if (new_ad_available) {
        ce0a_check();
    }
}

function show_publift_ads() {
    var new_ad_available = false;
    new_ad_available = show_publift_ad('ce0a_vertical') || new_ad_available;
    new_ad_available = show_publift_ad('ce0a_horizontal') || new_ad_available;
    new_ad_available = show_publift_ad('ce0a_mobile') || new_ad_available;
    new_ad_available = show_publift_ad('ce0a_vertical_2') || new_ad_available;
    new_ad_available = show_publift_ad('ce0a_vertical_3') || new_ad_available;
    if (new_ad_available) {
        ce0a_check();
        window.setTimeout(function() {
            if (!publift_site_loaded) {
                show_ads();
            }
        }, 10000);
    }
}

function init_ad(id) {
    try {
        var element = document.getElementById(id);
        if (!window.avt_all) {
            switch (id) {
                case 'ce0a_vertical':
                    reset_ad_options(element);
                    element.setAttribute('data-ad-slot', '4475785702');
                    element.setAttribute('data-ad-channel', '5013254699');
                    break;
                case 'ce0a_horizontal':
                    reset_ad_options(element);
                    element.setAttribute('data-ad-slot', '2999052504');
                    element.setAttribute('data-ad-channel', '2236909939');
                    break;
                case 'ce0a_mobile':
                    reset_ad_options(element);
                    element.setAttribute('data-ad-slot', '5952518908');
                    element.setAttribute('data-ad-channel', '8809029474');
                    break;
                case 'ce0a_rectangle':
                    reset_ad_options(element);
                    element.setAttribute('data-ad-slot', '4475785702');
                    element.setAttribute('data-ad-channel', '7065683253');
                    break;
                case 'ce0a_vertical_2':
                    reset_ad_options(element);
                    element.setAttribute('data-ad-slot', '4475785702');
                    element.setAttribute('data-ad-channel', '6845917285');
                    break;
                case 'ce0a_vertical_3':
                    reset_ad_options(element);
                    element.setAttribute('data-ad-slot', '4475785702');
                    element.setAttribute('data-ad-channel', '2914411131');
                    break;
                default:
            }
        }(adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
        window.setTimeout(function() {
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
            } catch (err) {}
        }, 1);
    }
}

function ad_title_check(title_id, ad_id, try_number) {
    try {
        if (try_number == undefined) {
            try_number = 0;
        }
        if (ad_check_timer[title_id] == undefined) {
            ad_check_timer[title_id] = null;
        }
        if (try_number == 0) {
            window.clearTimeout(ad_check_timer[title_id]);
        }
        var title = document.getElementById(title_id);
        if (title == null) {
            return;
        }
        if (!ce0a_blocked(ad_id)) {
            title.style.display = 'block';
        } else {
            title.style.display = 'none';
            ad_check_timer[title_id] = window.setTimeout(function() {
                ad_title_check(title_id, ad_id, try_number + 1)
            }, 1000);
        }
    } catch (err) {
        console.log(err);
    }
}

function add_download_finished_advertising() {
    window.setTimeout(function() {
        try {
            ad_title_check('ce0a_title_rectangle', 'ce0a_rectangle');
            if (adsense_enabled) {
                show_ad('ce0a_rectangle', true);
            } else {
                show_publift_ad('ce0a_rectangle');
            }
        } catch (err) {
            console.log(err);
        }
    }, 1);
}

function menu_display() {
    var menu = document.getElementById('menu').style;
    var invisible_menu = document.getElementById('invisible_menu').style;
    if (menu.display == 'none' || menu.display == '') {
        menu.display = 'block';
        invisible_menu.display = 'none';
    } else {
        menu.display = 'none';
        invisible_menu.display = 'block';
    }
}

function message_box(title, text) {
    var box = document.getElementById('message_box');
    box.innerHTML = '<div class="message_box_background" onclick="message_box_close()"></div><table class="message_box_outer_table" id="message_box_outer_table"><tr><td class="message_box_outer_td"><table class="message_box_table"><tr><td class="message_box_title">' + title + '</td><td class="message_box_close"> <img src="/images/9.6.0/close.png" onclick="message_box_close(true);" style="cursor: pointer;"></td></tr><tr><td colspan="2" class="message_box_content">' + text + '</td></tr><tr><td colspan="2" class="message_box_ok"><button type="button" class="convert_button" onclick="message_box_close();" style="width: auto; padding: 0px 15px">OK</button></td></tr></table></td></tr></table>';
    var box_content = document.getElementById('message_box_outer_table');
    var pos = getScrollPosition();
    box_content.style.top = pos[1] + 'px';
    box_content.style.left = pos[0] + 'px';
}

function message_box_close(x_close) {
    if (x_close == undefined) {
        x_close = false;
    }
    if (message_box_callback != undefined && message_box_callback != null && x_close == false) {
        message_box_callback();
        message_box_callback = null;
    }
    document.getElementById('message_box').innerHTML = '';
}

function show_file_formats() {
    message_box('Supported formats', '<div style="font-size: 14px; line-height: 1.5em"><div><div style="float: left" class="only_big_screen"><img src="/images/9.6.0/features/convert_icon.png" style="width: 80px; padding: 0px 20px"></div><div style="float: left"><span style="color: #AA0000"><b>The following file formats can be converted <span style="color: #550000">to PDF</span>:</b></span><br><table><tr><td><b>Documents:</b></td><td style="padding-left: 10px">pdf, xps, oxps, ps, rtf, txt</td></tr></table><table><tr><td><b>Images:</b></td><td style="padding-left: 10px">jpg (jpeg, jpe), gif, png, bmp, tif (tiff), mdi, psd, webp, heic, heif, jxl, jp2 (jpx, jpf, j2k, j2c, jpc), dng, nef, avif, emf, dcm</td></tr></table><table><tr><td><b>Word:</b></td><td style="padding-left: 10px">doc, docx, docm, dot, dotx, dotm, wps</td></tr></table><table><tr><td><b>Excel:</b></td><td style="padding-left: 10px">xls, xlsx, xlsm, xlsb, xlt, xltx, xltm</td></tr></table><table><tr><td><b>PowerPoint:</b></td><td style="padding-left: 10px">ppt, pps, pptx, ppsx, pptm, ppsm, pot, potx, potm</td></tr></table><table><tr><td><b>Publisher:</b></td><td style="padding-left: 10px">pub</td></tr></table><table><tr><td><b>OpenDocument:</b></td><td style="padding-left: 10px">odt, ods, odp, odg, odi, odm, odc, odf</td></tr></table><table><tr><td><b>E-Book:</b></td><td style="padding-left: 10px">epub, mobi, azw, azw3, azw4</td></tr></table><table><tr><td><b>Websites:</b></td><td style="padding-left: 10px">as XPS file necessary, <a href="/website2pdf">see instructions</a></td></tr></table></div><div style="clear: both"></div></div><div style="border-top: 1px solid #e9baba; margin-top: 10px; padding-top: 10px"><div style="float: left" class="only_big_screen"><img src="/images/9.6.0/features/pdf_export_icon.png" style="width: 70px; padding: 0px 25px"></div><div style="float: left"><div><span style="color: #AA0000"><b>Conversion <span style="color: #550000">from PDF</span> to:</b></span><br><b>Word</b> - doc, docx<br><b>Excel</b> - xls, xlsx<br><b>Powerpoint</b> - ppt, pptx<br><b>OpenOffice</b> - odt, ods, odp<br><b>Text</b> - rtf, txt<br><b>E-Book</b> - epub, mobi, azw3<br><b>Images</b> - jpg, png</div></div></div><div style="clear: both"></div></div></div>');
}

function getScrollPosition() {
    var x = 0,
        y = 0;
    if (typeof(window.pageYOffset) == 'number') {
        y = window.pageYOffset;
        x = window.pageXOffset;
    } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
        y = document.body.scrollTop;
        x = document.body.scrollLeft;
    } else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
        y = document.documentElement.scrollTop;
        x = document.documentElement.scrollLeft;
    }
    return [x, y];
}

function new_window(url, width, height) {
    if (width === undefined) {
        width = 500;
    }
    if (height === undefined) {
        height = 500;
    }
    var screen_width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var screen_height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
    if (screen_width < width) {
        width = screen_width;
    }
    if (screen_height < height) {
        height = screen_height;
    }
    window.open(url, '', 'width=' + width + ', height=' + height + ', top=' + (screen_height / 2 - height / 2) + ', left=' + (screen_width / 2 - width / 2) + '');
}

function show_advertising_horizontal_box(value) {
    var advertising_box = document.getElementById('ce0a_horizontal_box');
    if (advertising_box) {
        advertising_box.style.visibility = value ? 'visible' : 'hidden';
    }
    var advertising = document.getElementById('ce0a_horizontal');
    if (advertising) {
        advertising.style.display = value ? 'block' : 'none';
    }
    if (value == false) {
        ad_conversion_timer = window.setTimeout(function() {
            show_advertising_horizontal_box(true);
        }, 2000);
    } else {
        window.clearTimeout(ad_conversion_timer);
    }
}

function conversion_result_event() {
    if (window.location.href.indexOf('#') == -1) {
        var scrolledTop = getScrollPosition()[1];
        window.location.href = window.location.href + '#';
        window.scrollTo(0, scrolledTop);
        last_url = window.location.href;
    }
    url_change_timer = window.setInterval(function() {
        if (window.location.href != last_url) {
            back();
        }
    }, 100);
}

function generateSelectBoxes() {
    if (document.body.style.transform === undefined) {
        return;
    }
    var boxes = document.getElementsByTagName('select');
    var c = 0;
    for (var i = 0; i < boxes.length; i++) {
        var box = boxes[i];
        if (box.id == undefined || box.id == '') {
            while (document.getElementById('selectbox_original_' + c) != null) {
                c++;
            }
            box.id = 'selectbox_original_' + c;
        }
        var sibling = box.previousSibling;
        if (sibling != null) {
            if (sibling.getAttribute('customBox') != null && sibling.getAttribute('customBox') != '') {
                box.parentNode.removeChild(sibling);
            }
        }
        var divbox = document.createElement('div');
        divbox.setAttribute('customBox', '1');
        divbox.style.verticalAlign = 'middle';
        var tableLayout = '';
        if (box.style.width == 'auto') {
            tableLayout = 'table-layout: auto;';
        }
        divbox.innerHTML = '<div id="selectbox_' + i + '" class="' + (box.disabled ? 'customSelectBoxDisabled' : 'customSelectBox') + '" customSelectBoxIndex="' + i + '" customSelectBoxRefId="' + box.id + '" onclick="this.focus(); showSelectBoxContent(' + i + ', \'' + box.id + '\')" onmousedown="this.focus(); return false" onblur="selectBoxClose()" tabindex="0"><table style="width: 100%; height: 100%;"><tr><td style="vertical-align: middle"><div class="maxWidthFix" style="width: 100%; height: 100%; display: table; ' + tableLayout + '"><div id="selectbox_text_' + i + '" class="value">' + selectBoxGetValue(box[box.selectedIndex]) + '</div></div></td><td class="arrow"><div style="display: inline-block; vertical-align: middle; margin-bottom: 2px; width: 1px; height: 6px; background-color: #000000; transform: rotate(-45deg); margin-right: 3px"></div><div style="display: inline-block; vertical-align: middle; margin-bottom: 2px; width: 1px; height: 6px; background-color: #000000; transform: rotate(45deg)"></div></td></tr></table></div>';
        var compStyle = window.getComputedStyle(box);
        divbox.style.marginLeft = compStyle.getPropertyValue('margin-left');
        divbox.style.marginRight = compStyle.getPropertyValue('margin-right');
        divbox.style.marginTop = compStyle.getPropertyValue('margin-top');
        divbox.style.marginBottom = compStyle.getPropertyValue('margin-bottom');
        divbox.style.width = box.style.width;
        divbox.style.minWidth = box.style.minWidth;
        divbox.childNodes[0].style.width = box.style.width;
        divbox.childNodes[0].style.border = box.style.border;
        if (box.getAttribute('customSelectBoxHeight') != null) {
            divbox.childNodes[0].style.height = box.getAttribute('customSelectBoxHeight');
        }
        if (box.getAttribute('customSelectBoxFontSize') != null) {
            divbox.childNodes[0].style.fontSize = box.getAttribute('customSelectBoxFontSize');
        }
        divbox.className = box.className + ' customSelectBoxContainer';
        box.parentNode.insertBefore(divbox, box);
        box.style.display = 'none';
    }
}

function showSelectBoxContent(boxIndex, boxOriginalId) {
    var box = document.getElementById('selectbox_' + boxIndex);
    var boxOriginal = document.getElementById(boxOriginalId);
    if (boxOriginal.disabled) {
        selectBoxClose();
        return;
    }
    var screen = getScreenSizeWithoutScrollbars();
    var pos = getObjectPosition(box);
    var scrollX = getScrollPosition()[0];
    var scrollY = getScrollPosition()[1];
    var content = document.getElementById('selectbox_content');
    if (content.getAttribute('customSelectBoxRefId') == boxOriginalId) {
        selectBoxClose();
        return;
    }
    var topNew = (pos[1] + box.offsetHeight);
    content.style.display = 'block';
    content.style.top = topNew + 'px';
    content.style.left = '0px';
    content.style.width = 'auto';
    content.style.minWidth = box.offsetWidth + 'px';
    content.style.overflow = 'visible';
    content.style.height = 'auto';
    content.setAttribute('customSelectBoxRefId', boxOriginalId);
    content.setAttribute('customSelectBoxIndex', boxIndex);
    content.onmousedown = function() {
        box.onblur = function() {};
    };
    content.onmouseup = function() {
        box.focus();
        box.onblur = function() {
            selectBoxClose();
        };
    };
    var output = '';
    var nodes = boxOriginal.childNodes;
    var index = 0;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType == 1) {
            if (nodes[i].tagName.toLowerCase() == 'option') {
                if (nodes[i].disabled) {
                    if (nodes[i].text == '---') {
                        output += '<div class="space" onmousedown="return false;">';
                        if (i + 1 < nodes.length && nodes[i + 1].nodeType == 1 && nodes[i + 1].tagName.toLowerCase() != 'optgroup') {
                            output += '<div></div>';
                        }
                        output += '</div>';
                    } else {
                        var customSelectBoxValueSelected = '';
                        if (boxOriginal.selectedIndex == index) {
                            customSelectBoxValueSelected = 'customSelectBoxValueSelected="1" ';
                        }
                        output += '<div class="disabled" ' + customSelectBoxValueSelected + 'onmousedown="return false;"><span class="text">' + nodes[i].innerHTML + '</span></div>';
                    }
                } else {
                    var style = '';
                    if (nodes[i].getAttribute('customSelectBoxFontWeight') != null) {
                        style += 'font-weight: ' + nodes[i].getAttribute('customSelectBoxFontWeight') + ';';
                    }
                    if (nodes[i].getAttribute('customSelectBoxColor') != null) {
                        style += 'color: ' + nodes[i].getAttribute('customSelectBoxColor') + ';';
                    }
                    if (nodes[i].getAttribute('customSelectBoxFontFamily') != null) {
                        style += 'font-family: ' + nodes[i].getAttribute('customSelectBoxFontFamily') + ';';
                    }
                    if (nodes[i].getAttribute('customSelectBoxBackgroundColor') != null) {
                        style += 'background-color: ' + nodes[i].getAttribute('customSelectBoxBackgroundColor') + ';';
                    }
                    var iconColor = '';
                    if (nodes[i].getAttribute('customSelectBoxIconColor') != null) {
                        iconColor += '<div style="height: 16px; width: 16px; border: 1px solid #CCCCCC; margin-right: 10px; vertical-align: middle; display: inline-block; background-color: ' + nodes[i].getAttribute('customSelectBoxIconColor') + '"></div>';
                    }
                    var img = '';
                    if (nodes[i].getAttribute('customSelectBoxIcon') != null) {
                        img = '<img src="' + nodes[i].getAttribute('customSelectBoxIcon') + '" style="height: 24px; margin-right: 10px; vertical-align: middle">';
                    }
                    var className = '';
                    var customSelectBoxValueSelected = '';
                    if (boxOriginal.selectedIndex == index) {
                        className = 'valueHover selected';
                        customSelectBoxValueSelected = 'customSelectBoxValueSelected="1" ';
                    }
                    output += '<div class="value ' + className + '" style="' + style + '" ' + customSelectBoxValueSelected + 'customSelectBoxValueIndex="' + index + '" onmousemove="selectBoxMouseMove(this)" onmouseover="selectBoxMouseOver(this)" ontouchmove="selectBoxTouchMove(this)" onclick="selectBoxSelectValue(' + boxIndex + ', \'' + boxOriginalId + '\', ' + index + ')" onmousedown="return false;">' + iconColor + img + '<span class="text">' + nodes[i].innerHTML + '</span></div>';
                }
                index++;
            } else if (nodes[i].tagName.toLowerCase() == 'optgroup') {
                output += '<div class="group" onmousedown="return false;">' + nodes[i].label + '</div>';
            }
        }
    }
    content.innerHTML = output;
    content.className = 'customSelectBoxContent customSelectBoxContentMouse';
    content.style.width = (content.offsetWidth + 10) + 'px';
    var overlayMode = true;
    if (pos[0] + content.offsetWidth > scrollX + screen[0]) {
        if (screen[0] >= content.offsetWidth) {
            var left = scrollX + screen[0] - content.offsetWidth;
            content.style.left = left + 'px';
        } else {
            content.style.left = scrollX + 'px';
        }
        overlayMode = false;
    } else {
        content.style.left = pos[0] + 'px';
    }
    var selected = content.getElementsByClassName('selected');
    var obj = null;
    var top = 0;
    var height = 0;
    if (selected.length == 1) {
        obj = selected[0];
        top = (pos[1] - obj.offsetTop);
    } else {
        overlayMode = false;
    }
    top = 0;
    overlayMode = false;
    screen[1] = screen[1] - 10;
    scrollY = scrollY + 5;
    if (overlayMode && top > scrollY && top + content.offsetHeight < scrollY + screen[1]) {
        topNew = top;
        content.style.top = top + 'px';
    } else if (topNew + content.offsetHeight < scrollY + screen[1]) {} else if (pos[1] > scrollY + (screen[1] / 2)) {
        top = (pos[1] - content.offsetHeight);
        if (top > scrollY) {
            topNew = top;
            content.style.top = top + 'px';
        } else {
            content.style.overflow = 'auto';
            topNew = top;
            content.style.top = scrollY + 'px';
            height = pos[1] - scrollY;
            content.style.height = height + 'px';
            if (obj != null && obj.offsetTop > height) {
                content.scrollTop = obj.offsetTop;
            } else {
                content.scrollTop = 0;
            }
        }
    } else if (topNew + content.offsetHeight > scrollY + screen[1]) {
        content.style.overflow = 'auto';
        height = scrollY + screen[1] - topNew;
        content.style.height = height + 'px';
        if (obj != null && obj.offsetTop > height) {
            content.scrollTop = obj.offsetTop;
        } else {
            content.scrollTop = 0;
        }
    }
}

function selectBoxMouseMove(element) {
    var content = document.getElementById('selectbox_content');
    var nodes = content.childNodes;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType == 1) {
            nodes[i].removeAttribute('customSelectBoxValueSelected');
            nodes[i].className = nodes[i].className.replace(' valueHover', '');
        }
    }
    element.setAttribute('customSelectBoxValueSelected', '1');
    element.className = element.className.replace('value', 'value valueHover');
    content.className = 'customSelectBoxContent customSelectBoxContentMouse';
}

function selectBoxMouseOver(element) {
    var content = document.getElementById('selectbox_content');
    if (content.className == 'customSelectBoxContent customSelectBoxContentMouse') {
        selectBoxMouseMove(element);
    }
}

function selectBoxTouchMove(element) {
    var content = document.getElementById('selectbox_content');
    content.className = 'customSelectBoxContent';
}

function selectBoxKeySpace() {
    var obj = document.activeElement;
    showSelectBoxContent(obj.getAttribute('customSelectBoxIndex'), obj.getAttribute('customSelectBoxRefId'));
}

function selectBoxKeyUp() {
    var content = document.getElementById('selectbox_content');
    var nodes = content.childNodes;
    var previous = null;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType == 1) {
            if (nodes[i].getAttribute('customSelectBoxValueSelected') == '1') {
                if (previous !== null) {
                    nodes[i].removeAttribute('customSelectBoxValueSelected');
                    nodes[i].className = nodes[i].className.replace(' valueHover', '');
                    content.className = 'customSelectBoxContent';
                    previous.setAttribute('customSelectBoxValueSelected', '1');
                    previous.className = previous.className.replace('value', 'value valueHover');
                    if (previous.offsetTop < content.scrollTop || previous.offsetTop > content.scrollTop + content.offsetHeight - previous.offsetHeight) {
                        content.scrollTop = previous.offsetTop;
                    }
                    return false;
                }
            }
            var valueIndex = nodes[i].getAttribute('customSelectBoxValueIndex');
            if (valueIndex !== null && valueIndex !== '') {
                previous = nodes[i];
            }
        }
    }
}

function selectBoxKeyDown() {
    var content = document.getElementById('selectbox_content');
    var nodes = content.childNodes;
    var last = null;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType == 1) {
            var valueIndex = nodes[i].getAttribute('customSelectBoxValueIndex');
            if (valueIndex !== null && valueIndex !== '') {
                if (last !== null) {
                    last.removeAttribute('customSelectBoxValueSelected');
                    last.className = last.className.replace(' valueHover', '');
                    content.className = 'customSelectBoxContent';
                    nodes[i].setAttribute('customSelectBoxValueSelected', '1');
                    nodes[i].className = nodes[i].className.replace('value', 'value valueHover');
                    if (nodes[i].offsetTop > content.scrollTop + content.offsetHeight - nodes[i].offsetHeight || nodes[i].offsetTop < content.scrollTop) {
                        content.scrollTop = nodes[i].offsetTop - content.offsetHeight + nodes[i].offsetHeight;
                    }
                    return false;
                }
            }
            if (nodes[i].getAttribute('customSelectBoxValueSelected') == '1') {
                last = nodes[i];
            }
        }
    }
}

function selectBoxKeyLetter(letter) {
    var content = document.getElementById('selectbox_content');
    var nodes = content.childNodes;
    var last = null;
    var first = null;
    var current = null;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType == 1) {
            var valueIndex = nodes[i].getAttribute('customSelectBoxValueIndex');
            if (valueIndex !== null && valueIndex !== '') {
                var text = nodes[i].getElementsByClassName('text')[0];
                if (text.innerText.charAt(0).toLowerCase() == letter.toLowerCase()) {
                    if (first == null) {
                        first = nodes[i];
                    }
                    if (last != null && current == null) {
                        current = nodes[i];
                    }
                }
            }
            if (nodes[i].getAttribute('customSelectBoxValueSelected') == '1') {
                last = nodes[i];
            }
        }
    }
    if (current == null) {
        current = first;
    }
    if (current != null) {
        last.removeAttribute('customSelectBoxValueSelected');
        last.className = last.className.replace(' valueHover', '');
        content.className = 'customSelectBoxContent';
        current.setAttribute('customSelectBoxValueSelected', '1');
        current.className = current.className.replace('value', 'value valueHover');
        if (current.offsetTop > content.scrollTop + content.offsetHeight - current.offsetHeight || current.offsetTop < content.scrollTop) {
            content.scrollTop = current.offsetTop - content.offsetHeight + current.offsetHeight;
        }
    }
}

function selectBoxKeyEnter() {
    var content = document.getElementById('selectbox_content');
    var nodes = content.childNodes;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType == 1) {
            if (nodes[i].getAttribute('customSelectBoxValueSelected') == '1') {
                selectBoxSelectValue(content.getAttribute('customSelectBoxIndex'), content.getAttribute('customSelectBoxRefId'), nodes[i].getAttribute('customSelectBoxValueIndex'));
            }
        }
    }
}

function selectBoxSelectValue(boxIndex, boxOriginalId, index) {
    var box = document.getElementById('selectbox_' + boxIndex);
    var box_text = document.getElementById('selectbox_text_' + boxIndex);
    var boxOriginal = document.getElementById(boxOriginalId);
    boxOriginal.selectedIndex = index;
    box_text.innerHTML = selectBoxGetValue(boxOriginal[boxOriginal.selectedIndex]);
    selectBoxClose();
    if (boxOriginal.onchange) {
        boxOriginal.onchange();
    }
}

function selectBoxGetValue(box) {
    var style = '';
    if (box.getAttribute('customSelectBoxFontWeight') != null) {
        style += 'font-weight: ' + box.getAttribute('customSelectBoxFontWeight') + ';';
    }
    if (box.getAttribute('customSelectBoxColor') != null) {
        style += 'color: ' + box.getAttribute('customSelectBoxColor') + ';';
    }
    if (box.getAttribute('customSelectBoxFontFamily') != null) {
        style += 'font-family: ' + box.getAttribute('customSelectBoxFontFamily') + ';';
    }
    if (box.getAttribute('customSelectBoxBackgroundColor') != null) {
        style += 'background-color: ' + box.getAttribute('customSelectBoxBackgroundColor') + ';';
    }
    var iconColor = '';
    if (box.getAttribute('customSelectBoxIconColor') != null) {
        iconColor += '<div style="height: 16px; width: 16px; border: 1px solid #CCCCCC; margin-right: 10px; vertical-align: middle; display: inline-block; background-color: ' + box.getAttribute('customSelectBoxIconColor') + '"></div>';
    }
    var img = '';
    if (box.getAttribute('customSelectBoxIcon') != null) {
        img = '<img src="' + box.getAttribute('customSelectBoxIcon') + '" style="height: 16px; margin-right: 10px; vertical-align: middle">';
    }
    return iconColor + img + '<span class="text" style="' + style + '">' + box.innerHTML + '</span>';
}

function selectBoxClose() {
    var content = document.getElementById('selectbox_content');
    content.style.display = 'none';
    content.setAttribute('customSelectBoxRefId', '');
}

function selectBoxKeyEvents(event) {
    var key = event.which || event.keyCode;
    var obj = document.activeElement;
    if (obj && obj.className == 'customSelectBox') {
        var content = document.getElementById('selectbox_content');
        if (content.getAttribute('customSelectBoxRefId') == obj.getAttribute('customSelectBoxRefId')) {
            if (key == 37) { /*left*/ } else if (key == 38) { /*up*/
                selectBoxKeyUp();
                return false;
            } else if (key == 39) { /*right*/ } else if (key == 40) { /*down*/
                selectBoxKeyDown();
                return false;
            } else if (key == 13) { /*enter*/
                selectBoxKeyEnter();
                return false;
            } else if (key == 32) { /*space*/
                selectBoxKeyEnter();
                return false;
            } else if (key == 27) { /*escape*/
                selectBoxClose();
                return;
            } else {
                selectBoxKeyLetter(String.fromCharCode(key));
            }
        } else {
            if (key == 37) { /*left*/
                selectBoxKeySpace();
                selectBoxKeyUp();
                selectBoxKeyEnter();
                return false;
            } else if (key == 38) { /*up*/
                selectBoxKeySpace();
                selectBoxKeyUp();
                selectBoxKeyEnter();
                return false;
            } else if (key == 39) { /*right*/
                selectBoxKeySpace();
                selectBoxKeyDown();
                selectBoxKeyEnter();
                return false;
            } else if (key == 40) { /*down*/
                selectBoxKeySpace();
                selectBoxKeyDown();
                selectBoxKeyEnter();
                return false;
            } else if (key == 13) { /*enter*/
                selectBoxKeySpace();
                return false;
            } else if (key == 32) { /*space*/
                selectBoxKeySpace();
                return false;
            } else if (key == 27) { /*escape*/ }
        }
    }
    return true;
}

function init_windows() {
    if (document.getElementById('container_window').innerHTML != '') {
        return;
    }
    document.getElementById('container_window').innerHTML = '<div id="alert_nb_window" style="display: none; border: 1px solid #e18500; border-radius: 5px; background-color: #ffd9a2"><table style="width: 100%"><tr><td class="message_icon_td"><img src="/images/9.6.0/alert.png" alt="" style="width: 100%"></td><td style="text-align: left; padding: 25px 25px 25px 15px; font-size: 14px"><div id="alert_nb_window_title" style="color: #ca7700; font-size: 18px; font-weight:bold; padding-bottom: 5px"></div><div id="alert_nb_window_msg" style="line-height: 1.4em"></div></td></tr></table></div><div id="alert_window" style="display: none; border: 1px solid #e18500; border-radius: 5px; background-color: #ffd9a2"><table style="width: 100%"><tr><td class="message_icon_td"><img src="/images/9.6.0/alert.png" alt="" style="width: 100%"></td><td style="text-align: left; padding: 15px; font-size: 14px"><div id="alert_window_title" style="color: #ca7700; font-size: 18px; font-weight:bold; padding-bottom: 5px"></div><div id="alert_window_msg" style="line-height: 1.4em"></div><button type="button" onclick="back()" class="button_back_bright">&lt;&lt; Back</button></td></tr></table></div><div id="error_window" style="display: none; border: 1px solid #8c0000; border-radius: 5px; background-color: #FF9999"><table style="width: 100%"><tr><td class="message_icon_td"><img src="/images/9.6.0/error.png" alt="" style="width: 100%"></td><td style="text-align: left; padding: 15px; font-size: 14px"><div id="error_window_title" style="color: #AA0000; font-size: 18px; font-weight:bold; padding-bottom: 5px"></div><div id="error_window_msg" style="word-wrap: break-word; line-height: 1.4em"></div><button type="button" onclick="back()" class="button_back_bright">&lt;&lt; Back</button></td></tr></table></div><div id="progress_window" class="progress_window"><div style="border: 2px dashed #00AA00; border-radius: 5px; background-color: #CCFFCC; background: linear-gradient(#CCFFCC, #dcfbdb); width: 100%; box-sizing: border-box"><img src="/images/9.6.0/gears.gif" id="img_wait_2" alt="" class="conversion_icon mobile"><div style="float: left; text-align: center;"><img src="/images/9.6.0/gears.gif" id="img_wait_1" alt="" class="conversion_icon non_mobile"></div><div style="overflow: hidden"><div id="upload_info_1" style="padding: 15px 10px 5px 10px; font-weight: bold; text-align: left"></div><div id="upload_info_2" style="padding: 0px 10px 5px 10px; text-align: left"></div><div style="padding: 5px 10px 15px 10px; text-align: left"><b>Status:</b><div id="progress"></div><div id="progress_bar_container" class="progress_bar_container"></div><div id="progress_note" style="display: none"><table id="progress_note_content" style="margin-top: 10px; border: 1px solid #999999; border-radius: 5px; background-color: #FFFFFF; font-size: 12px;"><tr><td style="width: 50px"><img src="/images/9.6.0/info.png" style="width: 30px; margin: 10px 10px 10px 20px" alt=""></td><td style="padding: 10px 20px 10px 0px; text-align: left; vertical-align: middle; line-height: 1.4em"><div id="progress_note_msg"></div></td></tr></table></div></div></div><div style="clear: both"></div></div><div id="progress_frame"></div><iframe name="upload_frame" style="width: 0px; height: 0px; border: 0px solid #000000" id="upload_frame"></iframe></div><div id="completed_window" style="display: none"><div style="border: 2px dashed #00AA00; border-radius: 5px; background-color: #CCFFCC; background: linear-gradient(#CCFFCC, #dcfbdb); text-align: center; padding: 15px"><table style="width: 100%"><tr><td style="vertical-align: middle; text-align: center"><table style="margin: auto"><tr><td style="vertical-align: middle;"><img src="/images/9.6.0/check.png" alt="" class="completed_icon"></td><td style="padding: 5px 0px; text-align: left; vertical-align: middle;"><div class="completed_window_text"><b>Task finished. The download will be started immediately...</b></div><div style="font-size: 12px; margin-top: 5px">By default the file is located in your download folder after saving the file.</div></td></tr></table></td><td rowspan="2" style="text-align: right"><div class="ce0a_rectangle_box" style="padding-left: 20px; margin: auto 0px auto auto"><div class="ce0a_horizontal_box_title" id="ce0a_title_rectangle" style="display: none;">Advertisements</div><div id="ce0a_rectangle_container" style="margin: auto"></div></div></td><tr><td style="padding-top: 10px; text-align: center"><div style="font-size: 14px; border: 1px solid #AAAAAA; border-radius: 5px; padding: 5px; line-height: 1.3em; background-color: #F3F3F3; margin-bottom: 10px;" id="completed_window_link_container"><div id="completed_window_link_waiting" style="text-align: center">The download starts automatically. Please wait...</div><div id="completed_window_link" style="text-align: center"></div></div><div id="completed_window_warnings" style="font-size: 12px; border: 1px solid #AAAAAA; border-radius: 5px; padding: 10px; background-color: #F3F3F3; margin-bottom: 10px"><div style="font-weight: bold; color: #c16d00">Note: </div><div id="completed_window_warnings_content" style="word-wrap: break-word;"></div></div><div id="completed_window_info_booklet_duplex_short_edge" style="font-size: 14px; border: 1px solid #AAAAAA; border-radius: 5px; padding: 10px; background-color: #F3F3F3; margin-bottom: 10px; line-height: 1.6em"><table><tr><td><img src="/images/9.6.0/preferences/layout_printer_mode_duplex_icon.png" alt="" style="margin: 0px 10px"></td><td style="vertical-align: middle"><div style="font-size: 18px"><b>Printing guide:</b></div></td></tr></table><div>When printing the file please make sure that you enable the option for <b>Duplex-Printing ("print on both sides of paper")</b> and that you also select <b>"Flip on short edge"</b>. Afterwards you can fold the stack of papers in the middle and get a ready booklet.</div></div><div id="completed_window_info_booklet_duplex_long_edge" style="font-size: 14px; border: 1px solid #AAAAAA; border-radius: 5px; padding: 10px; background-color: #F3F3F3; margin-bottom: 10px; line-height: 1.6em"><table><tr><td><img src="/images/9.6.0/preferences/layout_printer_mode_duplex_icon.png" alt="" style="margin: 0px 10px"></td><td style="vertical-align: middle"><div style="font-size: 18px"><b>Printing guide:</b></div></td></tr></table><div>When printing the file please make sure that you enable the option for <b>Duplex-Printing ("print on both sides of paper")</b> and that you also select <b>"Flip on long edge"</b>. Afterwards you can fold the stack of papers in the middle and get a ready booklet.</div></div><div id="completed_window_info_booklet_paperfeed_front" style="font-size: 14px; border: 1px solid #AAAAAA; border-radius: 5px; padding: 10px; background-color: #F3F3F3; margin-bottom: 10px; line-height: 1.6em"><table><tr><td><img src="/images/9.6.0/preferences/layout_printer_mode_paperfeed_front_icon.png" alt="" style="margin: 0px 10px"></td><td style="vertical-align: middle"><div style="font-size: 18px"><b>Printing guide:</b></div></td></tr></table><div>The file "Booklet.zip" contains 2 PDF files. One of them contains the frontsides, the other one contains the backsides. First, you have to print the file <b>*_Booklet_Part_1.pdf</b>, then put the pages back into the paper feed <b>in the same direction</b> and afterwards print the file <b>*_Booklet_Part_2.pdf</b>. After printing you can fold the stack of paper in the middle and get a ready booklet.</div></div><div id="completed_window_info_booklet_paperfeed_back" style="font-size: 14px; border: 1px solid #AAAAAA; border-radius: 5px; padding: 10px; background-color: #F3F3F3; margin-bottom: 10px; line-height: 1.6em"><table><tr><td><img src="/images/9.6.0/preferences/layout_printer_mode_paperfeed_back_icon.png" alt="" style="margin: 0px 10px"></td><td style="vertical-align: middle"><div style="font-size: 18px"><b>Printing guide:</b></div></td></tr></table><div>The file "Booklet.zip" contains 2 PDF files. One of them contains the frontsides, the other one contains the backsides. First, you have to print the file <b>*_Booklet_Part_1.pdf</b>, then you have to <b>turn over the stack of paper</b> (over the longer edge of the page), put the pages back into the paper feed and afterwards print the file <b>*_Booklet_Part_2.pdf</b>. After printing you can fold the stack of paper in the middle and get a ready booklet.</div></div><div style="margin: 0px 0px 15px 0px; font-size: 14px; line-height: 1.3em; border: 1px solid #c16d00; background-color: #ffe4c2; border-radius: 5px; padding: 10px; display: block; text-align: center">Are you satisfied with the result?<br>I would be glad if you support or recommend this website!<div style="text-align: center; margin-top: 5px;"><a href="/donation" class="button_donation">Support project with donation</a><div class="socialmedia_conversion"><a href="https://www.facebook.com/Online2PDF" target="_blank"><img src="/images/9.6.0/socialmedia/facebook_icon.png" alt="Facebook" title="Facebook"></a><a href="https://twitter.com/Online2PDF" target="_blank"><img src="/images/9.6.0/socialmedia/twitter_icon.png" alt="Twitter" title="Twitter"></a><a href="https://www.linkedin.com/company/online2pdf" target="_blank"><img src="/images/9.6.0/socialmedia/linkedin_icon.png" alt="LinkedIn" title="LinkedIn"></a><a href="https://www.youtube.com/channel/UCpbq9zpPLprwRBRUx8wqaSw" target="_blank"><img src="/images/9.6.0/socialmedia/youtube_icon.png" alt="YouTube" title="YouTube"></a><a href="https://www.instagram.com/online2pdf" target="_blank"><img src="/images/9.6.0/socialmedia/instagram_icon.png" alt="Instagram" title="Instagram"></a><a href="https://www.tiktok.com/@online2pdf" target="_blank"><img src="/images/9.6.0/socialmedia/tiktok_icon.png" alt="TikTok" title="TikTok"></a></div></div></div><div style="text-align: center; margin: 10px"><button type="button" onclick="back()" class="button_back" style="margin-right: 15px;">&lt;&lt; Back</button> <button type="button" onclick="convert_more_files()" class="button_back">Convert other files</button></div></td></tr></table></div></div>';
    preload('/images/9.6.0/button_pagecomposition.png', '/images/9.6.0/button_rotation.png', '/images/9.6.0/button_password.png', '/images/9.6.0/button_ppa.png', '/images/9.6.0/button_small_ppa.png', '/images/9.6.0/button_small_split.png', '/images/9.6.0/button_delete.png', '/images/9.6.0/button_delete_hover.png', '/images/9.6.0/file_icon/excel.png', '/images/9.6.0/file_icon/image.png', '/images/9.6.0/file_icon/odf_calc.png', '/images/9.6.0/file_icon/odf_draw.png', '/images/9.6.0/file_icon/odf_impress.png', '/images/9.6.0/file_icon/odf_math.png', '/images/9.6.0/file_icon/odf_write.png', '/images/9.6.0/file_icon/pdf_format.png', '/images/9.6.0/file_icon/powerpoint.png', '/images/9.6.0/file_icon/ps.png', '/images/9.6.0/file_icon/publisher.png', '/images/9.6.0/file_icon/rtf.png', '/images/9.6.0/file_icon/txt.png', '/images/9.6.0/file_icon/unknown.png', '/images/9.6.0/file_icon/word.png', '/images/9.6.0/file_icon/xps.png', '/images/9.6.0/file_icon/ebook.png', '/images/9.6.0/true2.png', '/images/9.6.0/false2.png');
}

function show_message_reload() {
    document.getElementById('js_error').style.display = 'block';
    document.getElementById('js_error').innerHTML = 'A new version of the converter is available. Please refresh the page.<br><button onclick="window.location.reload(true)" class="button_back" style="margin-top: 10px">Refresh</button>';
}

function init(version) {
    if (version != '9.6.0-12') {
        show_message_reload();
        return;
    }
    document.getElementById('main_window').style.display = 'block';
    if (document.getElementById('pref_element_1').style.transition == undefined) {
        old_browser = true;
    }
    preferences_image_content_position_horizontal_changed();
    preferences_image_content_position_vertical_changed();
    preferences_image_content_size_changed();
    preferences_image_content_size_unit_changed();
    preferences_image_page_size_changed();
    preferences_image_layout_mode_changed();
    preferences_layout_page_size_changed();
    preferences_layout_content_size_changed();
    preferences_layout_content_size_unit_changed();
    preferences_layout_content_position_horizontal_changed();
    preferences_layout_content_position_vertical_changed();
    preferences_layout_mode_changed();
    preferences_layout_printer_mode_changed();
    add_file(0);
    document.onmousemove = mouseMove;
    document.onmouseup = mouseUp;
    window.onbeforeunload = unload_site;
    if (document.addEventListener) {
        document.addEventListener('dragenter', drag, false);
        document.addEventListener('dragexit', drag, false);
        document.addEventListener('dragover', drag, false);
        document.addEventListener('drop', drop, false);
    }
    document.forms[0].elements['export_ocr_language'].value = 'en';
    document.forms[0].elements['pdf_advanced_ocr_language'].value = 'en';
    if (window.location.href.indexOf('#') != -1) {
        window.location.href = window.location.href.substr(0, window.location.href.indexOf('#'));
    }
    document.forms[0].setAttribute('autocomplete', 'off');
}

function messageReceived(e) {
    if (e.origin != 'https://ads.online2pdf.com') {
        return;
    }
    if (e.data == 'site_loaded') {
        publift_site_loaded = true;
        try {
            sendMessage('site_loaded_verified', e.source);
        } catch (e) {
            show_ads();
        }
    }
    if (e.data == 'ads_blocked') {
        publift_ads_blocked_counter++;
        if (publift_ads_blocked_counter >= 2) { /*publift_ads_blocked = true;*/
            show_ads();
        }
    } /*console.log('received message:  ' + e.data);*/
}

function sendMessage(data, dest) {
    dest.postMessage(data, 'https://ads.online2pdf.com');
}

function windowResized() {
    if (adsense_enabled) {
        show_ads();
    } else {
        show_publift_ads();
    }
}

function global_init() {
    if (document.body.style.transform !== undefined) {
        generateSelectBoxes();
        document.onkeydown = selectBoxKeyEvents;
    }
    window.setTimeout(function() {
        if (window.addEventListener) {
            window.addEventListener('message', messageReceived);
            window.addEventListener('resize', windowResized);
        }
        if ((ad_mode == 1 || !window.avt_all) && !publift_only) {
            show_ads();
        } else {
            show_publift_ads();
        }
    }, 10);
}
var ppa_timer = null;
var last_url = '';
var ppa_page_info = new Array();
var ppa_page_info_first = true;
var ppa_pages = 0;
var ppa_page_start_id = 0;
var ppa_page_end_id = 0;
var ppa_script_loaded = false;
var ppa_filebox;
var ppa_file_index;
var ppa_mode_specific;
var ppa_filename = '';
var ppa_file;
var ppa_textbox_pages;
var ppa_textbox_rotation90;
var ppa_textbox_rotation180;
var ppa_textbox_rotation270;
var ppa_textbox_password;
var ppa_password;
var ppa_scroll_timer = null;
var ppa_zoom = 1;
var ppa_mousedown = false;
var ppa_mode = 'select';
var ppa_rotation_mode = 1;
var ppa_page_offset_x;
var ppa_page_offset_y;
var ppa_page_pos_x;
var ppa_page_pos_y;
var ppa_page_split_info = new Array();
var ppa_textfield_changed_timer = null;
var ppa_loaded_pages = 0;
var ppa_page_rotation_info = new Array();
var scrollTop_saved = 0;
var ppa_reorder_zIndex = 10;
var ppa_page_offset_x_new;
var ppa_page_offset_y_new;
var ppa_mouse_pointer = null;
var ppa_view_abort = false;
var ppa_page_last_selected = 0;
var ppa_page_shift_pressed = false;
var ppa_touch_timer = null;
var ppa_touch_hold_active = false;
var ppa_touch_active = false;
var ppa_touch_scroll_position = 0;

function ppa_page_mousedown(e, id) {
    ppa_page_shift_pressed = false;
    ppa_page_start_id = id;
    ppa_show_help('');
    if (ppa_mode == 'reorder') {
        var mouse_pointer = get_mouse_pointer(e);
        ppa_page_offset_x = mouse_pointer[0];
        ppa_page_offset_y = mouse_pointer[1];
        var page_box = document.getElementById('ppa_page_box_' + ppa_page_start_id);
        ppa_reorder_zIndex++;
        page_box.style.zIndex = ppa_reorder_zIndex;
        page_box.style.transition = 'top 0s, left 0s, z-index 0s linear 0s';
        var pos = getObjectPosition(page_box);
        ppa_page_pos_x = pos[0];
        ppa_page_pos_y = pos[1];
        ppa_page_offset_x_new = mouse_pointer[0] - pos[0];
        ppa_page_offset_y_new = mouse_pointer[1] - pos[1];
    }
    if (!e) {
        e = window.event;
    }
    if (e.shiftKey) {
        if (ppa_page_last_selected != 0 && ppa_page_last_selected != id) {
            ppa_page_start_id = ppa_page_last_selected;
            ppa_page_mousemove(id);
            ppa_page_shift_pressed = true;
        }
    }
}

function ppa_page_mousedown2() {
    ppa_mousedown = true;
    document.getElementById('ppa_textfield').blur();
    document.getElementById('ppa_textfield_rotation90').blur();
    document.getElementById('ppa_textfield_rotation180').blur();
    document.getElementById('ppa_textfield_rotation270').blur();
    window.clearTimeout(ppa_textfield_changed_timer);
}

function ppa_page_touchstart(e, id) {}

function ppa_page_touchstart2(e) {
    ppa_touch_active = true;
    ppa_page_reorder_touch_fix();
    var id = ppa_get_id_touchmove(e);
    ppa_touch_timer = window.setTimeout(function() {
        ppa_touch_hold_active = true;
        ppa_touch_scroll_position = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        document.getElementById('ppa_page_box_' + id).className = 'ppa_page_marked';
        ppa_page_mousedown2();
        if (id == 0) {} else {
            e.clientX = e.changedTouches[0].clientX;
            e.clientY = e.changedTouches[0].clientY;
            ppa_page_mousedown(e, id);
        }
    }, 300);
    return true;
}

function ppa_page_mouseup(ppa_page_mouseup_id) {
    if (ppa_mode == 'reorder') {
        return;
    }
    if (ppa_mode == 'split') {
        return;
    }
    if (ppa_page_start_id == 0) {
        return;
    }
    if (ppa_page_start_id == ppa_page_mouseup_id) {
        ppa_page_click(ppa_page_mouseup_id);
        return;
    }
    var nodes = document.getElementById('ppa_pages').childNodes;
    var selection_inner = false;
    var status;
    if (ppa_page_info_first) {
        status = ppa_page_info[ppa_page_start_id];
    } else {
        status = !ppa_page_info[ppa_page_start_id];
    }
    if (ppa_page_shift_pressed) {
        status = !status;
    }
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType == 1) {
            var current_id = ppa_get_page_id(nodes[i].id);
            if (selection_inner || current_id == ppa_page_start_id || current_id == ppa_page_mouseup_id) {
                ppa_page_click(current_id, status, false);
            }
            if (current_id == ppa_page_start_id || current_id == ppa_page_mouseup_id) {
                selection_inner = !selection_inner;
            }
        }
    }
    ppa_refresh();
}

function ppa_page_mouseup2() {
    if (!ppa_mousedown) {
        return;
    }
    ppa_mousedown = false;
    if (ppa_mode == 'select' || ppa_mode == 'rotate') {
        if (ppa_page_end_id > 0) {
            ppa_page_mouseup(ppa_page_end_id);
        } else {
            ppa_refresh();
        }
    } else if (ppa_mode == 'reorder' && ppa_page_start_id > 0) {
        var page_box = document.getElementById('ppa_page_box_' + ppa_page_start_id);
        page_box.style.transition = 'top 1s, left 1s, z-index 0s linear 1s';
        page_box.style.top = '0px';
        page_box.style.left = '0px';
        ppa_page_start_id = 0;
        ppa_refresh();
    } else if (ppa_mode == 'split') {
        ppa_page_start_id = 0;
    }
}

function ppa_page_touchend(id) {}

function ppa_page_touchend2(e) {
    window.clearTimeout(ppa_touch_timer);
    ppa_touch_hold_active = false;
    var id = ppa_get_id_touchmove(e);
    ppa_page_mouseup2();
    if (id == 0) {} else {
        ppa_page_mouseup(id);
    }
}

function ppa_page_mousemove(ppa_page_mousemove_id) {
    if (ppa_mode == 'reorder') {
        return;
    }
    if (ppa_mode == 'split') {
        return;
    }
    ppa_page_end_id = ppa_page_mousemove_id;
    if (ppa_page_start_id == 0) {
        if (ppa_mousedown) {
            ppa_page_start_id = ppa_page_mousemove_id;
        } else {
            return;
        }
    }
    var nodes = document.getElementById('ppa_pages').childNodes;
    var selection_inner = false;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType == 1) {
            var current_id = ppa_get_page_id(nodes[i].id);
            if (selection_inner || current_id == ppa_page_start_id || current_id == ppa_page_mousemove_id) {
                if (ppa_mode == 'rotate') {
                    if (ppa_page_info[current_id]) {
                        nodes[i].className = 'ppa_page_marked';
                    }
                } else {
                    nodes[i].className = 'ppa_page_marked';
                }
            } else {
                if (ppa_mode == 'rotate') {
                    if (ppa_page_info[current_id]) {
                        nodes[i].className = 'ppa_page';
                    } else {
                        nodes[i].className = 'ppa_page ppa_page_hidden';
                    }
                } else if (ppa_page_info_first) {
                    nodes[i].className = 'ppa_page';
                } else {
                    if (ppa_page_info[current_id]) {
                        nodes[i].className = 'ppa_page_selected';
                    } else {
                        nodes[i].className = 'ppa_page_removed';
                    }
                }
            }
            if (ppa_page_start_id != ppa_page_mousemove_id) {
                if (current_id == ppa_page_start_id || current_id == ppa_page_mousemove_id) {
                    selection_inner = !selection_inner;
                }
            }
        }
    }
}

function ppa_page_mousemove2(e) {
    window.clearInterval(ppa_scroll_timer);
    if (ppa_page_start_id == 0) {
        return;
    }
    if (!e) {
        e = window.event;
    }
    var posY = e.clientY;
    if (ppa_mode == 'reorder') {
        var element = document.getElementById('ppa_page_box_' + ppa_page_start_id);
        var mouse_pointer = get_mouse_pointer(e);
        if (ppa_mouse_pointer == null) {
            ppa_mouse_pointer = mouse_pointer;
        }
        var mouse_min_delta = 5;
        var moving_right = mouse_pointer[0] - ppa_mouse_pointer[0] > mouse_min_delta;
        var moving_left = ppa_mouse_pointer[0] - mouse_pointer[0] > mouse_min_delta;
        var moving_down = mouse_pointer[1] - ppa_mouse_pointer[1] > mouse_min_delta;
        var moving_up = ppa_mouse_pointer[1] - mouse_pointer[1] > mouse_min_delta;
        if (Math.abs(mouse_pointer[0] - ppa_mouse_pointer[0]) > mouse_min_delta || Math.abs(mouse_pointer[1] - ppa_mouse_pointer[1]) > mouse_min_delta) {
            ppa_mouse_pointer = mouse_pointer;
        }
        for (var i = 1; i <= ppa_pages; i++) {
            var page_box = document.getElementById('ppa_page_box_' + i);
            var page_box_moved = document.getElementById('ppa_page_box_' + ppa_page_start_id);
            var pos = getObjectPosition(page_box);
            var margin = 5;
            if (ppa_page_start_id != i && (pos[0] - margin < mouse_pointer[0] && mouse_pointer[0] < pos[0] + page_box.offsetWidth + margin) && (pos[1] - margin < mouse_pointer[1] && mouse_pointer[1] < pos[1] + page_box.offsetHeight + margin)) {
                if ((ppa_page_pos_x < pos[0] && moving_right) || (ppa_page_pos_y + element.offsetHeight / 2 < pos[1] + page_box.offsetHeight / 2 && moving_down)) {
                    page_box.parentNode.insertBefore(page_box_moved, page_box.nextSibling);
                } else if ((ppa_page_pos_x > pos[0] && moving_left) || (ppa_page_pos_y + element.offsetHeight / 2 > pos[1] + page_box.offsetHeight / 2 && moving_up)) {
                    page_box.parentNode.insertBefore(page_box_moved, page_box);
                } else {
                    break;
                }
                var pos_new = getObjectPosition(page_box);
                var page_box_inner = document.getElementById('ppa_page_box_inner_' + i);
                page_box_inner.style.transition = 'left 0s, top 0s';
                page_box_inner.style.left = (pos[0] - pos_new[0]) + 'px';
                page_box_inner.style.top = (pos[1] - pos_new[1]) + 'px';
                window.setTimeout(function() {
                    page_box_inner.style.transition = 'left 0.5s, top 0.5s';
                    page_box_inner.style.left = '0px';
                    page_box_inner.style.top = '0px';
                }, 10);
                element.style.top = '0px';
                element.style.left = '0px';
                var element_pos = getObjectPosition(element);
                ppa_page_pos_x = element_pos[0];
                ppa_page_pos_y = element_pos[1];
                break;
            }
        }
        var new_pos_x = mouse_pointer[0] - ppa_page_pos_x - ppa_page_offset_x_new;
        var new_pos_y = mouse_pointer[1] - ppa_page_pos_y - ppa_page_offset_y_new;
        element.style.top = new_pos_y + 'px';
        element.style.left = new_pos_x + 'px';
    }
    if (posY > 98 / 100 * window.innerHeight) {
        ppa_scroll(10, 10, e);
    } else if (posY > 96 / 100 * window.innerHeight) {
        ppa_scroll(10, 5, e);
    } else if (posY > 94 / 100 * window.innerHeight) {
        ppa_scroll(10, 3, e);
    } else if (posY > 92 / 100 * window.innerHeight) {
        ppa_scroll(10, 1, e);
    } else if (posY < 2 / 100 * window.innerHeight) {
        ppa_scroll(10, -10, e);
    } else if (posY < 4 / 100 * window.innerHeight) {
        ppa_scroll(10, -5, e);
    } else if (posY < 6 / 100 * window.innerHeight) {
        ppa_scroll(10, -3, e);
    } else if (posY < 8 / 100 * window.innerHeight) {
        ppa_scroll(10, -1, e);
    }
}

function ppa_page_touchmove(id) {}

function ppa_page_touchmove2(e) {
    window.clearTimeout(ppa_touch_timer);
    if (ppa_touch_hold_active) {
        window.scrollTo(0, ppa_touch_scroll_position);
    }
    var id = 0;
    if (ppa_mode != 'reorder') {
        id = ppa_get_id_touchmove(e);
    }
    e.clientX = e.changedTouches[0].clientX;
    e.clientY = e.changedTouches[0].clientY;
    ppa_page_mousemove2(e);
    if (id == 0) {} else {
        ppa_page_mousemove(id);
    }
    return !ppa_touch_hold_active;
}

function ppa_get_id_touchmove(e) {
    var pointer = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
    for (var i = 1; i <= ppa_pages; i++) {
        var page_box = document.getElementById('ppa_page_box_' + i);
        var pos = getObjectPosition(page_box);
        if ((pos[0] < pointer[0] && pointer[0] < pos[0] + page_box.offsetWidth) && (pos[1] < pointer[1] && pointer[1] < pos[1] + page_box.offsetHeight)) {
            return i;
        }
    }
    return 0;
}

function ppa_adjust_menu() {
    if (window.innerWidth < 500) {
        ppa_change_view(0.18);
    } else if (window.innerWidth < 1100) {
        ppa_change_view(0.30);
    }
}

function ppa_shortkey(e) {
    if (!e) {
        e = window.event;
    }
    var key = (e.keyCode != 0) ? e.keyCode : e.which;
    if (e.ctrlKey && String.fromCharCode(key).toLowerCase() == 'a') {
        if (ppa_mode == 'select') {
            ppa_select_all();
        } else if (ppa_mode == 'rotate') {
            for (var i = 1; i <= ppa_pages; i++) {
                ppa_page_rotation_info[i] += ppa_rotation_mode;
            }
            ppa_refresh();
        }
        return false;
    }
}

function ppa_shortkey_up(e) {}

function ppa_close() {
    document.onkeydown = selectBoxKeyEvents;
    document.onkeyup = function() {};
    window.onresize = function() {};
    ppa_view_abort = true;
    window.clearInterval(ppa_timer);
    window.clearTimeout(ppa_textfield_changed_timer);
    var ppa_textfield = document.getElementById('ppa_textfield');
    var ppa_textfield_rotation90 = document.getElementById('ppa_textfield_rotation90');
    var ppa_textfield_rotation180 = document.getElementById('ppa_textfield_rotation180');
    var ppa_textfield_rotation270 = document.getElementById('ppa_textfield_rotation270');
    var main_content = document.getElementById('main_content');
    main_content.style.display = 'block';
    var pdf_box = document.getElementById('pdf_interactive');
    var selection_used = false;
    if (ppa_textfield) {
        ppa_textbox_pages.value = ppa_textfield.value;
        ppa_textbox_pages.focus();
        if (ppa_textbox_pages.value != '') {
            selection_used = true;
        }
    }
    var rotation_used = false;
    if (ppa_textbox_rotation90 && ppa_textfield_rotation90) {
        ppa_textbox_rotation90.value = ppa_textfield_rotation90.value;
        ppa_textbox_rotation180.value = ppa_textfield_rotation180.value;
        ppa_textbox_rotation270.value = ppa_textfield_rotation270.value;
        if (ppa_textbox_rotation90.value != '' || ppa_textbox_rotation180.value != '' || ppa_textbox_rotation270.value != '') {
            rotation_used = true;
        }
    }
    pdf_box.style.display = 'none';
    pdf_box.innerHTML = '';
    window.scrollTo(0, scrollTop_saved);
    activate_features();
    edit_file_info_check(ppa_file_box, ppa_file_index);
    if (ppa_mode == 'rotate' && rotation_used) { /*edit_file(ppa_file_box, ppa_file_index, 2, true);*/ } else if (selection_used) { /*edit_file(ppa_file_box, ppa_file_index, 1, true);*/ }
}

function button_reset_group(element) {
    var parent = element.parentNode;
    var nodes = parent.childNodes;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType == 1) {
            nodes[i].className = nodes[i].className.replace(' ppa_button_selected', '');
        }
    }
}

function button_click(element) {
    button_reset_group(element);
    element.className = element.className + ' ppa_button_selected';
}

function ppa_show_help(content) {
    var ppa_help = document.getElementById('ppa_help');
    if (content == '') {
        ppa_help.style.display = 'none';
    } else {
        ppa_help.style.display = 'block';
        ppa_help.innerHTML = '<table><tr><td>' + content + '</td><td><a href="javascript:void(0)" onclick="ppa_show_help(\'\')" class="button_ok">OK</a></td></tr></table>';
    }
}

function ppa_hide_submenu() {
    ppa_hide('ppa_submenu_selection');
    ppa_hide('ppa_submenu_reorder');
    ppa_hide('ppa_submenu_split');
    ppa_hide('ppa_submenu_rotation');
}

function ppa_show_submenu(id) {
    ppa_hide_submenu();
    document.getElementById(id).style.display = 'inline-block';
}

function ppa_hide(id) {
    document.getElementById(id).style.display = 'none';
}

function ppa_show_textfield() {
    document.getElementById('ppa_textfield_rotation_container').style.display = 'none';
    document.getElementById('ppa_textfield_container').style.display = 'inline-block';
}

function ppa_show_rotation_textfield() {
    document.getElementById('ppa_textfield_rotation_container').style.display = 'inline-block';
    document.getElementById('ppa_textfield_container').style.display = 'none';
}

function button_click_select() {
    button_click(document.getElementById('ppa_button_select'));
    ppa_show_help('Click on the pages to select them. <span class="ppa_help_extra">Multiple pages can be selected at the same time with pressed mouse button. If you want to delete some pages, select all pages first (by clicking on <b><i>Select all pages</i></b> button) and then deselect the pages which you want to delete.</span>');
    ppa_show_submenu('ppa_submenu_selection');
    ppa_mode = 'select';
    ppa_show_textfield();
    ppa_refresh();
}

function button_click_reorder() {
    button_click(document.getElementById('ppa_button_reorder'));
    if (ppa_touch_active) {
        ppa_show_help('You can reorder particular pages by holding your finger down on the PDF page for a short moment and moving the page to the desired position.');
    } else {
        ppa_show_help('Move the pages with pressed mouse button to reorder them.');
    }
    ppa_show_submenu('ppa_submenu_reorder');
    ppa_mode = 'reorder';
    ppa_show_textfield();
    ppa_refresh();
    ppa_page_reorder_touch_fix();
}

function button_click_split() {
    button_click(document.getElementById('ppa_button_split'));
    ppa_show_help('Click between two pages in order to split the file there.');
    ppa_show_submenu('ppa_submenu_split');
    ppa_mode = 'split';
    ppa_show_textfield();
    ppa_refresh();
    var root = document.getElementById('ppa_pages');
    var nodes = root.childNodes;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType == 1) {
            var node = nodes[i];
            node.style.zIndex = 'auto';
        }
    }
}

function button_click_rotate(mode) {
    button_click(document.getElementById('ppa_button_rotate'));
    ppa_show_help('Click on the pages in order to rotate them. <span class="ppa_help_extra">Multiple pages can be rotated at the same time with pressed mouse button.</span>');
    ppa_show_submenu('ppa_submenu_rotation');
    ppa_mode = 'rotate';
    ppa_rotation_mode = mode;
    ppa_button_rotate_img_update();
    ppa_show_rotation_textfield();
    ppa_refresh();
}

function ppa_button_rotate_img_update() {
    switch (ppa_rotation_mode) {
        case 1:
            button_click(document.getElementById('ppa_button_rotation90'));
            document.getElementById('ppa_button_img_rotation').src = document.getElementById('ppa_button_img_rotation90').src;
            break;
        case 2:
            button_click(document.getElementById('ppa_button_rotation180'));
            document.getElementById('ppa_button_img_rotation').src = document.getElementById('ppa_button_img_rotation180').src;
            break;
        case -1:
            button_click(document.getElementById('ppa_button_rotation270'));
            document.getElementById('ppa_button_img_rotation').src = document.getElementById('ppa_button_img_rotation270').src;
            break;
    }
}

function ppa_page_check() {
    if (ppa_page_info_first) {
        for (var i = 1; i <= ppa_pages; i++) {
            ppa_page_info[i] = false;
        }
        ppa_page_info_first = false;
    }
}

function ppa_select_all() {
    ppa_page_info_first = false;
    for (var i = 1; i <= ppa_pages; i++) {
        ppa_page_info[i] = true;
    }
    ppa_refresh();
    ppa_show_help('All pages have been selected. If you want to delete particular pages, you can deselect the pages by clicking on them.');
}

function ppa_reverse() {
    ppa_page_check();
    for (var i = 1; i <= ppa_pages; i++) {
        ppa_page_info[i] = !ppa_page_info[i];
    }
    ppa_refresh();
    ppa_show_help('The page selection has been inverted.');
}

function ppa_select_reset() {
    for (var i = 1; i <= ppa_pages; i++) {
        ppa_page_info[i] = true;
    }
    ppa_page_info_first = true;
    ppa_refresh();
}

function ppa_reset() {
    ppa_select_reset();
    ppa_reorder_reset();
    ppa_split_reset();
    ppa_rotation_reset();
    ppa_show_help('All pages have been reset.');
}

function ppa_page_click(id, status, refresh) {
    ppa_page_last_selected = 0;
    if (ppa_page_shift_pressed && id == ppa_page_start_id) {
        return;
    }
    if (refresh === undefined) {
        refresh = true;
    }
    if (ppa_mode == 'reorder') {
        return;
    } else if (ppa_mode == 'split') {
        return;
    } else if (ppa_mode == 'rotate') {
        ppa_page_rotation_info[id] = ppa_page_rotation_info[id] + ppa_rotation_mode;
        if (refresh) {
            ppa_refresh();
            ppa_page_last_selected = id;
        }
        return;
    } else if (ppa_mode == 'select') {
        ppa_page_check();
        if (status === undefined) {
            status = !ppa_page_info[id];
        }
        ppa_page_info[id] = status;
        if (refresh) {
            ppa_refresh();
            ppa_page_last_selected = id;
        }
    }
}

function get_mouse_pointer(e) {
    if (!e) {
        e = window.event;
    }
    var posX = e.clientX;
    var posY = e.clientY;
    var scrolled_top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    var scrolled_left = (document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft;
    return [posX + scrolled_left, posY + scrolled_top];
}

function ppa_scroll(interval, step, e) {
    window.clearInterval(ppa_scroll_timer);
    ppa_scroll_timer = window.setInterval(function() {
        ppa_page_mousemove2(e);
        window.scrollBy(0, step);
        ppa_touch_scroll_position += step;
    }, interval);
}

function ppa_redraw_page_rotation(id) {
    var canvas = document.getElementById('pdf_page_' + id);
    var canvas_container = document.getElementById('ppa_canvas_container_' + id);
    var rotation = ppa_page_rotation_info[id] * 90;
    canvas.style.transform = 'rotate(' + rotation + 'deg)';
    if (ppa_page_rotation_info[id] % 2 == 0) {
        canvas.style.left = '0px';
        canvas.style.bottom = '0px';
        canvas_container.style.width = (canvas.width * ppa_zoom + 4) + 'px';
        canvas_container.style.height = (canvas.height * ppa_zoom + 4) + 'px';
    } else {
        canvas.style.left = (canvas.height - canvas.width) * ppa_zoom / 2 + 'px';
        canvas.style.bottom = (canvas.height - canvas.width) * ppa_zoom / 2 + 'px';
        canvas_container.style.width = (canvas.height * ppa_zoom + 4) + 'px';
        canvas_container.style.height = (canvas.width * ppa_zoom + 4) + 'px';
    }
}

function ppa_redraw() {
    if (ppa_mode == 'init') {
        return;
    }
    ppa_page_start_id = 0;
    ppa_page_end_id = 0;
    for (var i = 1; i <= ppa_pages; i++) {
        var split_operator = document.getElementById('ppa_page_split_operator_' + i);
        if (ppa_page_info[i] == false) {
            ppa_page_split_info[i] = false;
        }
        if (ppa_page_split_info[i]) {
            split_operator.className = 'ppa_page_split_operator_active';
        } else {
            split_operator.className = 'ppa_page_split_operator';
        }
        ppa_redraw_page_rotation(i);
    }
    if (ppa_mode == 'reorder') {
        ppa_page_check_final();
        for (var i = 1; i <= ppa_pages; i++) {
            var page_box = document.getElementById('ppa_page_box_' + i);
            if (ppa_page_info[i]) {
                page_box.className = 'ppa_page ppa_page_reorder';
            } else {
                page_box.className = 'ppa_page ppa_page_hidden';
            }
        }
    } else if (ppa_mode == 'split') {
        ppa_page_check_final();
        for (var i = 1; i <= ppa_pages; i++) {
            var page_box = document.getElementById('ppa_page_box_' + i);
            if (ppa_page_info[i]) {
                page_box.className = 'ppa_page_split';
            } else {
                page_box.className = 'ppa_page ppa_page_hidden';
            }
        }
    } else if (ppa_mode == 'rotate') {
        ppa_page_check_final();
        for (var i = 1; i <= ppa_pages; i++) {
            var page_box = document.getElementById('ppa_page_box_' + i);
            if (ppa_page_info[i]) {
                page_box.className = 'ppa_page';
            } else {
                page_box.className = 'ppa_page ppa_page_hidden';
            }
        }
    } else if (ppa_mode == 'select') {
        ppa_page_check();
        for (var i = 1; i <= ppa_pages; i++) {
            var page_box = document.getElementById('ppa_page_box_' + i);
            if (ppa_page_info[i]) {
                page_box.className = 'ppa_page_selected';
            } else {
                page_box.className = 'ppa_page_removed';
            }
        }
        if (ppa_page_check_final()) {
            for (var i = 1; i <= ppa_pages; i++) {
                var page_box = document.getElementById('ppa_page_box_' + i);
                page_box.className = 'ppa_page';
            }
        }
    }
}

function ppa_page_check_final() {
    var all_removed = true;
    for (var i = 1; i <= ppa_pages; i++) {
        if (ppa_page_info[i] == true) {
            all_removed = false;
        }
    }
    if (all_removed) {
        for (var i = 1; i <= ppa_pages; i++) {
            ppa_page_info[i] = true;
        }
        ppa_page_info_first = true;
    }
    return all_removed;
}

function ppa_page_all_unselected() {
    for (var i = 1; i <= ppa_pages; i++) {
        var page_box = document.getElementById('ppa_page_box_' + i);
        if (page_box.className != 'ppa_page') {
            return false;
        }
    }
    return true;
}

function ppa_refresh() {
    window.clearInterval(ppa_scroll_timer);
    ppa_redraw();
    var range_start = 0;
    var text = '';
    var split_before = false;
    var root = document.getElementById('ppa_pages');
    var nodes = root.childNodes;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType == 1) {
            var node = nodes[i];
            var page = ppa_get_page_id(node.id);
            var next_page_selected = false;
            var next_page = 0;
            if (node.nextSibling) {
                while (node.nextSibling && next_page_selected == false) {
                    next_page = ppa_get_page_id(node.nextSibling.id);
                    next_page_selected = ppa_page_info[next_page];
                    node = node.nextSibling;
                }
            }
            var next_page_in_range = (next_page_selected == true && next_page == parseInt(page) + 1);
            if (range_start > 0) {
                if (page < ppa_pages && next_page_in_range && ppa_page_split_info[page] == false) {
                    continue;
                } else {
                    if (text != '' && split_before == false) {
                        text = text + ', ';
                    }
                    split_before = false;
                    text = text + range_start + '-' + page;
                    range_start = 0;
                    if (ppa_page_split_info[page]) {
                        text = text + ' | ';
                        split_before = true;
                    }
                }
            } else if (ppa_page_info[page] == true) {
                if (page < ppa_pages && next_page_in_range && ppa_page_split_info[page] == false) {
                    range_start = page;
                } else {
                    if (text != '' && split_before == false) {
                        text = text + ', ';
                    }
                    split_before = false;
                    text = text + page;
                    if (ppa_page_split_info[page]) {
                        text = text + ' | ';
                        split_before = true;
                    }
                }
            }
        }
    }
    if (text == '1-' + ppa_pages && ppa_page_all_unselected()) {
        text = '';
    }
    document.getElementById('ppa_textfield').value = text;
    document.getElementById('ppa_textfield_info').style.display = 'none';
    if (document.getElementById('ppa_textfield').value.length >= 3000) {
        ppa_textfield_info.innerHTML = 'Page selection is too long. Please select less pages.';
        ppa_textfield_info.style.display = 'inline-block';
    }
    ppa_refresh_rotation(1, document.getElementById('ppa_textfield_rotation90'));
    ppa_refresh_rotation(2, document.getElementById('ppa_textfield_rotation180'));
    ppa_refresh_rotation(3, document.getElementById('ppa_textfield_rotation270'));
}

function ppa_refresh_rotation(rotation, textfield) {
    var range_start = 0;
    var text = '';
    for (var i = 1; i <= ppa_pages; i++) {
        var next_page_in_range = false;
        if (i < ppa_pages) {
            next_page_in_range = (ppa_page_rotation_info[i + 1] % 4 + 4) % 4 == rotation;
        }
        if (range_start > 0) {
            if (i < ppa_pages && next_page_in_range) {
                continue;
            } else {
                if (text != '') {
                    text = text + ', ';
                }
                text = text + range_start + '-' + i;
                range_start = 0;
            }
        } else if ((ppa_page_rotation_info[i] % 4 + 4) % 4 == rotation) {
            if (i < ppa_pages && next_page_in_range) {
                range_start = i;
            } else {
                if (text != '') {
                    text = text + ', ';
                }
                text = text + i;
            }
        }
    }
    textfield.value = text;
    if (textfield.value.length >= 3000) {
        ppa_textfield_info.innerHTML = 'Die Seitenauswahl ist leider zu lang. Bitte wählen Sie weniger Seiten aus.';
        ppa_textfield_info.style.display = 'inline-block';
    }
}

function ppa_get_page_id(text) {
    var id_split = text.split('_');
    return id_split[id_split.length - 1];
}

function ppa_load(file_box, file_index, mode, password) {
    try {
        ppa_password = '';
        ppa_file_box = file_box;
        ppa_file_index = file_index;
        scrollTop_saved = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        if (dropped_files['userfile[' + file_box + ']']) {
            ppa_file = dropped_files['userfile[' + file_box + ']'][file_index];
        } else {
            ppa_file = document.forms['form1'].elements['userfile[' + file_box + '][]'].files[file_index];
        }
        ppa_mode_specific = mode;
        ppa_filename = ppa_file.name;
        ppa_textbox_pages = document.forms['form1'].elements['userfile_pagecomposition[' + file_box + '][' + file_index + ']'];
        ppa_textbox_password = document.forms['form1'].elements['userfile_password[' + file_box + '][' + file_index + ']'];
        if (password == undefined) {
            ppa_password = ppa_textbox_password.value;
        } else {
            ppa_password = password;
        }
        ppa_textbox_rotation90 = document.forms['form1'].elements['userfile_rotation90[' + file_box + '][' + file_index + ']'];
        ppa_textbox_rotation180 = document.forms['form1'].elements['userfile_rotation180[' + file_box + '][' + file_index + ']'];
        ppa_textbox_rotation270 = document.forms['form1'].elements['userfile_rotation270[' + file_box + '][' + file_index + ']'];
        ppa_view();
    } catch (err) {
        ppa_close();
        message_box('Error', 'Unfortunately, the PDF page wizard is not available for the selected file.');
        console.log(err);
    }
}

function ppa_change_view(zoom) {
    ppa_zoom = zoom;
    for (var i = 1; i <= ppa_pages; i++) {
        var canvas = document.getElementById('pdf_page_' + i);
        canvas.style.width = zoom * canvas.width + 'px';
        canvas.style.height = zoom * canvas.height + 'px';
        ppa_redraw_page_rotation(i);
    }
}

function ppa_textfield_changed(value) {
    window.clearTimeout(ppa_textfield_changed_timer);
    ppa_textfield_changed_timer = window.setTimeout(function() {
        ppa_textfield_changed_worker(value)
    }, 500);
}

function ppa_textfield_changed_worker(value) {
    var ppa_textfield_info = document.getElementById('ppa_textfield_info');
    ppa_textfield_info.innerHTML = '';
    ppa_textfield_info.style.display = 'none';
    var page_array = [];
    if (value.match(/^\s*(\d+|\d+\s*-\s*\d*)(\s*[,;\|\/]\s*(\d+|\d+\s*-\s*\d*))*\s*[,;\|\/]?\s*$/)) {
        var parts = value.split(/[\|\/]/);
        for (var i = 0; i < parts.length; i++) {
            var pages = [];
            var page_ranges = parts[i].split(/[,;]/);
            for (var k = 0; k < page_ranges.length; k++) {
                var page_range = page_ranges[k].split('-');
                var page_start = parseInt(page_range[0].replace(' ', ''));
                if (page_range.length == 2) {
                    var page_end = parseInt(page_range[1].replace(' ', ''));
                    if (page_end >= 1) {
                        if (page_start < page_end) {
                            for (var m = page_start; m <= page_end; m++) {
                                pages.push(m);
                            }
                        } else {
                            for (var m = page_start; m >= page_end; m--) {
                                pages.push(m);
                            }
                        }
                    } else {
                        for (var m = page_start; m <= ppa_pages; m++) {
                            pages.push(m);
                        }
                    }
                } else if (page_start >= 1) {
                    pages.push(page_start);
                }
            }
            if (pages.length > 0) {
                page_array.push(pages);
            }
        }
    } else if (value.trim() != '') {
        ppa_textfield_info.innerHTML = 'Input is invalid.';
        ppa_textfield_info.style.display = 'inline-block';
    }
    ppa_page_info_first = false;
    var root = document.getElementById('ppa_pages');
    var last = root.childNodes[0];
    for (var i = 1; i <= ppa_pages; i++) {
        var page_box = document.getElementById('ppa_page_box_' + i);
        root.insertBefore(page_box, last);
        last = page_box.nextSibling;
        ppa_page_info[i] = false;
    }
    last = root.childNodes[0];
    var page_number_error = false;
    var page_number_twice = false;
    var all_used_page_numbers = new Array();
    for (var i = 0; i < page_array.length; i++) {
        for (var k = 0; k < page_array[i].length; k++) {
            var id = page_array[i][k];
            if (id >= 1 && id <= ppa_pages) {
                if (all_used_page_numbers.indexOf(id) >= 0) {
                    page_number_twice = true;
                }
                all_used_page_numbers.push(id);
                var page_box = document.getElementById('ppa_page_box_' + id);
                root.insertBefore(page_box, last);
                last = page_box.nextSibling;
                ppa_page_info[id] = true;
                if (k == page_array[i].length - 1 && i < page_array.length - 1) {
                    ppa_page_split_info[id] = true;
                }
            } else {
                page_number_error = true;
            }
        }
    }
    if (page_number_twice) {
        ppa_textfield_info.innerHTML = 'One page is used multiple times. That is indeed allowed and will be applied correctly during the conversion but it is not visible here in the preview.';
        ppa_textfield_info.style.display = 'inline-block';
    } else if (page_number_error) {
        ppa_textfield_info.innerHTML = 'The page numbers are outside the valid range.';
        ppa_textfield_info.style.display = 'inline-block';
    }
    ppa_redraw();
}

function ppa_textfield_rotation_changed(value, rotation) {
    window.clearTimeout(ppa_textfield_changed_timer);
    ppa_textfield_changed_timer = window.setTimeout(function() {
        ppa_textfield_rotation_changed_worker(value, rotation)
    }, 500);
}

function ppa_textfield_rotation_changed_worker(value, rotation) {
    var ppa_textfield_info = document.getElementById('ppa_textfield_info');
    ppa_textfield_info.innerHTML = '';
    ppa_textfield_info.style.display = 'none';
    var pages = [];
    if (value.match(/^\s*(\d+|\d+\s*-\s*\d*)(\s*[,;]\s*(\d+|\d+\s*-\s*\d*))*\s*[,;]?\s*$/)) {
        var page_ranges = value.split(/[,;]/);
        for (var k = 0; k < page_ranges.length; k++) {
            var page_range = page_ranges[k].split('-');
            var page_start = parseInt(page_range[0].replace(' ', ''));
            if (page_range.length == 2) {
                var page_end = parseInt(page_range[1].replace(' ', ''));
                if (page_end >= 1) {
                    if (page_start < page_end) {
                        for (var m = page_start; m <= page_end; m++) {
                            pages.push(m);
                        }
                    } else {
                        for (var m = page_start; m >= page_end; m--) {
                            pages.push(m);
                        }
                    }
                } else {
                    for (var m = page_start; m <= ppa_pages; m++) {
                        pages.push(m);
                    }
                }
            } else if (page_start >= 1) {
                pages.push(page_start);
            }
        }
    } else if (value.trim() != '') {
        ppa_textfield_info.innerHTML = 'Input is invalid.';
        ppa_textfield_info.style.display = 'inline-block';
    }
    var page_number_error = false;
    for (var i = 0; i < pages.length; i++) {
        var id = pages[i];
        if (id >= 1 && id <= ppa_pages) {
            ppa_page_rotation_info[id] = rotation;
        } else {
            page_number_error = true;
        }
    }
    for (var i = 1; i <= ppa_pages; i++) {
        if ((ppa_page_rotation_info[i] % 4 + 4) % 4 == rotation && pages.indexOf(i) == -1) {
            ppa_page_rotation_info[i] = 0;
        }
    }
    if (page_number_error) {
        ppa_textfield_info.innerHTML = 'The page numbers are outside the valid range.';
        ppa_textfield_info.style.display = 'inline-block';
    }
    ppa_redraw();
}

function ppa_reorder_reset() {
    var root = document.getElementById('ppa_pages');
    var last = root.childNodes[0];
    for (var i = 1; i <= ppa_pages; i++) {
        var page_box = document.getElementById('ppa_page_box_' + i);
        root.insertBefore(page_box, last);
        last = page_box.nextSibling;
    }
    ppa_refresh();
}

function ppa_rotation_reset() {
    for (var i = 1; i <= ppa_pages; i++) {
        ppa_page_rotation_info[i] = 0;
    }
    ppa_refresh();
}

function ppa_split_reset() {
    for (var i = 1; i <= ppa_pages; i++) {
        ppa_page_split_info[i] = false;
    }
    ppa_refresh();
}

function ppa_split(id, type) {
    if (ppa_mode != 'split') {
        return;
    }
    if (type == 'before') {
        var page_box = document.getElementById('ppa_page_box_' + id);
        if (!page_box.previousSibling) {
            return;
        }
        id = ppa_get_page_id(page_box.previousSibling.id);
    }
    ppa_page_split_info[id] = !ppa_page_split_info[id];
    ppa_refresh();
}

function ppa_page_loaded(loaded_pages) {
    if (loaded_pages != undefined) {
        ppa_loaded_pages = loaded_pages;
    } else {
        ppa_loaded_pages++;
    }
    var box = document.getElementById('ppa_loaded_pages');
    var text = document.getElementById('ppa_loaded_pages_text');
    var bar = document.getElementById('ppa_loaded_pages_bar');
    var percent = Math.round(ppa_loaded_pages / ppa_pages * 100);
    box.style.display = 'block';
    box.style.visibility = 'visible';
    var text_content = '%PPA_LOADED_PAGES% of %PPA_ALL_PAGES% pages loaded. (' + percent + '%)';
    text_content = text_content.replace('%PPA_LOADED_PAGES%', ppa_loaded_pages);
    text_content = text_content.replace('%PPA_ALL_PAGES%', ppa_pages);
    text.innerHTML = text_content;
    bar.style.width = percent + '%';
    if (ppa_loaded_pages == ppa_pages) {
        box.style.maxHeight = '0px';
        box.style.visibility = 'hidden';
    }
}

function ppa_page_reorder_touch_fix() {
    for (var i = 1; i <= ppa_pages; i++) {
        var page_box = document.getElementById('ppa_page_box_' + i);
        page_box.style.pointerEvents = (ppa_touch_active == false || ppa_mode != 'reorder') ? 'auto' : 'none';
    }
}

function ppa_supported() {
    var useragent = navigator.userAgent;
    if (useragent.indexOf('MSIE 9.0') != -1 || useragent.indexOf('MSIE 8.0') != -1 || useragent.indexOf('MSIE 7.0') != -1 || useragent.indexOf('MSIE 6.0') != -1) {
        return false;
    }
    return true;
}

function ppa_view() {
    ppa_view_abort = false;
    var main_content = document.getElementById('main_content');
    main_content.style.display = 'none';
    var pdf_box = document.getElementById('pdf_interactive');
    pdf_box.style.display = 'block';
    pdf_box.innerHTML = '<table style="width: 100%; height: 100%"><tr><td style="text-align: center; vertical-align: middle"><img src="/images/9.6.0/gears.gif" alt="Loading..."><br><div style="font-size: 18px; font-weight: bold; padding: 20px; display: inline-block">Please wait...</div><p><a href="#" onclick="ppa_close();">Cancel</a></p></td></tr></table>';
    if (!ppa_script_loaded) {
        ppa_script_loaded = true;
        var script = document.createElement('script');
        script.src = '/pdf.js';
        script.onload = function() {
            if (ppa_view_abort == false) {
                ppa_view();
            }
        };
        document.head.appendChild(script);
        return;
    }
    document.onkeydown = ppa_shortkey;
    document.onkeyup = ppa_shortkey_up;
    window.onresize = ppa_adjust_menu;
    ppa_page_info_first = true;
    window.location.href = '#';
    last_url = window.location.href;
    var file_url = URL.createObjectURL(ppa_file);
    window.clearInterval(ppa_timer);
    ppa_timer = window.setInterval(function() {
        if (window.location.href != last_url) {
            ppa_close();
        }
    }, 100);
    PDFJS.workerSrc = '/pdf.worker.js';
    var param = {
        url: file_url,
        password: ppa_password
    };
    PDFJS.getDocument(param).then(function(pdf) {
        ppa_textbox_password.value = ppa_password;
        var pages = pdf.numPages;
        ppa_pages = pages;
        var html = '<div class="ppa" onmousemove="ppa_page_mousemove2(event);"><div style="touch-action: pan-y" onmousedown="ppa_page_mousedown2(); return false;" onmouseup="ppa_page_mouseup2()" ontouchstart="return ppa_page_touchstart2(event);" ontouchend="ppa_page_touchend2(event)" ontouchmove="return ppa_page_touchmove2(event)" ontouchcancel="ppa_page_touchend2(event)" oncontextmenu="return false;"><div class="ppa_menu_container"><div class="ppa_menu"><div style="float: left"><div class="ppa_group ppa_group_finish"><div class="ppa_button ppa_button_big" onclick="ppa_close()"><img src="/images/9.6.0/ppa/check.png" alt="">Done!</div></div><div class="ppa_group ppa_group_main"><div class="ppa_button" onclick="button_click_select()" id="ppa_button_select"><table><tr><td><img src="/images/9.6.0/ppa/select.png" alt="" title="Select pages"></td><td><span>Select pages</span></td></tr></table></div><div class="ppa_button" onclick="button_click_reorder()" id="ppa_button_reorder"><table><tr><td><img src="/images/9.6.0/ppa/move.png" alt="" title="Reorder pages"></td><td><span>Reorder pages</span></td></tr></table></div><div class="ppa_button" onclick="button_click_split()" id="ppa_button_split"><table><tr><td><img src="/images/9.6.0/ppa/split.png" alt="" title="Split file"></td><td><span>Split file</span></td></tr></table></div><div class="ppa_button" onclick="button_click_rotate(ppa_rotation_mode)" id="ppa_button_rotate"><table><tr><td><img src="/images/9.6.0/ppa/rotate.png" id="ppa_button_img_rotation" alt="" title="Rotate pages"></td><td><span>Rotate pages</span></td></tr></table></div></div><div class="ppa_group ppa_submenu ppa_group_options" id="ppa_submenu_selection"><div class="ppa_button ppa_button_select_all" onclick="ppa_select_all()"><table><tr><td><img src="/images/9.6.0/ppa/select_all.png" alt="" title="Select all pages"></td><td><span>Select all pages</span></td></tr></table></div><div class="ppa_button" onclick="ppa_reverse()"><table><tr><td><img src="/images/9.6.0/ppa/reverse.png" alt="" title="Invert selection"></td><td><span>Invert selection</span></td></tr></table></div><div class="ppa_button" onclick="ppa_reset()"><table><tr><td><img src="/images/9.6.0/ppa/reset.png" alt="" title="Reset"></td><td><span>Reset</span></td></tr></table></div></div><div class="ppa_group ppa_submenu ppa_group_options" id="ppa_submenu_reorder"><div class="ppa_button" onclick="ppa_reset()"><table><tr><td><img src="/images/9.6.0/ppa/reset.png" alt="" title="Reset"></td><td><span>Reset</span></td></tr></table></div></div><div class="ppa_group ppa_submenu ppa_group_options" id="ppa_submenu_split"><div class="ppa_button" onclick="ppa_reset()"><table><tr><td><img src="/images/9.6.0/ppa/reset.png" alt="" title="Reset"></td><td><span>Reset</span></td></tr></table></div></div><div id="ppa_submenu_rotation" class="ppa_submenu ppa_group_options"><div class="ppa_group"><div class="ppa_button ppa_button_rotate" onclick="button_click_rotate(-1)" id="ppa_button_rotation270"><table><tr><td><img src="/images/9.6.0/ppa/rotate_270.png" id="ppa_button_img_rotation270" alt="" title="Left"></td><td><span>Left</span></td></tr></table></div><div class="ppa_button ppa_button_rotate" onclick="button_click_rotate(2)" id="ppa_button_rotation180"><table><tr><td><img src="/images/9.6.0/ppa/rotate_180.png" id="ppa_button_img_rotation180" alt="" title="Upside down"></td><td><span style="white-space: nowrap;">Upside down</span></td></tr></table></div><div class="ppa_button ppa_button_rotate" onclick="button_click_rotate(1)" id="ppa_button_rotation90"><table><tr><td><img src="/images/9.6.0/ppa/rotate.png" id="ppa_button_img_rotation90" alt="" title="Right"></td><td><span>Right</span></td></tr></table></div></div><div class="ppa_group"><div class="ppa_button" onclick="ppa_reset()"><table><tr><td><img src="/images/9.6.0/ppa/reset.png" alt="" title="Reset"></td><td><span>Reset</span></td></tr></table></div></div></div></div><div style="float: right;"><div class="ppa_group ppa_group_view"><div class="ppa_label">View:</div><div class="ppa_button" onclick="button_click(this); ppa_change_view(0.25)"><table><tr><td><img src="/images/9.6.0/ppa/small.png" alt="" title="Small"></td><td><span>Small</span></td></tr></table></div><div class="ppa_button" onclick="button_click(this); ppa_change_view(0.5)" id="ppa_button_view_middle"><table><tr><td><img src="/images/9.6.0/ppa/medium.png" alt="" title="Medium"></td><td><span>Medium</span></td></tr></table></div><div class="ppa_button" onclick="button_click(this); ppa_change_view(1)"><table><tr><td><img src="/images/9.6.0/ppa/large.png" alt="" title="Groß"></td><td><span>Large</span></td></tr></table></div></div></div><div style="clear: both;"></div></div><div class="ppa_loaded_pages" id="ppa_loaded_pages"><div class="ppa_loaded_pages_bar" id="ppa_loaded_pages_bar"></div><div class="ppa_loaded_pages_text" id="ppa_loaded_pages_text"></div></div><div class="ppa_help" id="ppa_help"></div></div><div class="ppa_content" id="ppa_content"><div class="ppa_file">' + ppa_filename + '</div><div id="ppa_pages">';
        for (var i = 1; i <= pages; i++) {
            html += '<div class="ppa_page" onmousedown="ppa_page_mousedown(event, ' + i + ')" onmouseup="ppa_page_mouseup(' + i + ')" onmousemove="ppa_page_mousemove(' + i + ')" id="ppa_page_box_' + i + '"><div id="ppa_page_box_inner_' + i + '" style="position: relative"><div class="ppa_page_split_area" style="left: -5px; padding: 5px 0px 5px 5px; z-index: 4" onclick="ppa_split(' + i + ', \'before\')"><div class="ppa_page_split_operator" style="left: -2px;"></div></div><div class="ppa_page_info" id="ppa_page_info_' + i + '"></div><div class="ppa_page_number" onmousedown="return false"><div>' + i + '</div></div><div id="ppa_canvas_container_' + i + '" class="ppa_canvas_container"><canvas id="pdf_page_' + i + '" class="ppa_canvas"></canvas></div><div class="ppa_page_split_area" style="left: 50%; padding: 5px 5px 5px 0px; z-index: 5" onclick="ppa_split(' + i + ', \'after\')"><div class="ppa_page_split_operator" style="right: -2px;" id="ppa_page_split_operator_' + i + '"></div></div></div></div>';
            ppa_page_info[i] = true;
            ppa_page_split_info[i] = false;
            ppa_page_rotation_info[i] = 0;
        }
        html += '</div></div></div><div class="ppa_footer"><div style="text-align: center"><div id="ppa_debug3" class="ppa_textfield_info"></div></div><div style="text-align: center"><div id="ppa_debug" class="ppa_textfield_info"></div></div><div style="text-align: center"><div id="ppa_debug2" class="ppa_textfield_info"></div></div><div style="text-align: center"><div id="ppa_textfield_info" class="ppa_textfield_info"></div></div><div style="display: inline-block; margin-bottom: 10px"><div class="ppa_textfield_rotation_container_all"><div style="display: inline-block" id="ppa_textfield_rotation_container"><div class="ppa_textfield_rotation_container"><div class="ppa_textfield_description"><div>Rotate pages by 90°:</div></div><input type="text" placeholder="Enter pages manually... (e.g. 1, 2, 3)" class="ppa_textfield" id="ppa_textfield_rotation90" maxlength="3000" onkeyup="ppa_textfield_rotation_changed(this.value, 1)"></div><div class="ppa_textfield_rotation_container"><div class="ppa_textfield_description"><div>Rotate pages by 180°:</div></div><input type="text" placeholder="Enter pages manually... (e.g. 1, 2, 3)" class="ppa_textfield" id="ppa_textfield_rotation180" maxlength="3000" onkeyup="ppa_textfield_rotation_changed(this.value, 2)"></div><div class="ppa_textfield_rotation_container"><div class="ppa_textfield_description"><div>Rotate pages by 270°:</div></div><input type="text" placeholder="Enter pages manually... (e.g. 1, 2, 3)" class="ppa_textfield" id="ppa_textfield_rotation270" maxlength="3000" onkeyup="ppa_textfield_rotation_changed(this.value, 3)"></div></div></div><div class="ppa_textfield_container"><div style="display: inline-block" id="ppa_textfield_container"><div class="ppa_textfield_description"><div>Extract pages in the following order:</div></div><input type="text" class="ppa_textfield" placeholder="Enter pages manually... (e.g. 1, 2, 3)" id="ppa_textfield" maxlength="3000" onkeyup="ppa_textfield_changed(this.value)"></div></div><div class="ppa_button ppa_button_ok" style="vertical-align: bottom" onclick="ppa_close();">Done!</div></div></div></div>';
        pdf_box.innerHTML = html;
        button_click(document.getElementById('ppa_button_view_middle'));
        ppa_change_view(0.5);
        ppa_page_loaded(0);
        ppa_mode = 'init';
        document.getElementById('ppa_textfield').value = ppa_textbox_pages.value;
        ppa_textfield_changed_worker(ppa_textbox_pages.value);
        document.getElementById('ppa_textfield_rotation90').value = ppa_textbox_rotation90.value;
        ppa_textfield_rotation_changed_worker(ppa_textbox_rotation90.value, 1);
        document.getElementById('ppa_textfield_rotation180').value = ppa_textbox_rotation180.value;
        ppa_textfield_rotation_changed_worker(ppa_textbox_rotation180.value, 2);
        document.getElementById('ppa_textfield_rotation270').value = ppa_textbox_rotation270.value;
        ppa_textfield_rotation_changed_worker(ppa_textbox_rotation270.value, 3);
        switch (ppa_mode_specific) {
            case 'rotation90':
                button_click_rotate(1);
                break;
            case 'rotation180':
                button_click_rotate(2);
                break;
            case 'rotation270':
                button_click_rotate(-1);
                break;
            default:
                button_click_select();
                ppa_button_rotate_img_update();
        }
        ppa_adjust_menu();
        for (var i = 1; i <= pages; i++) {
            (function() {
                var pageIndex = i;
                pdf.getPage(i).then(function(page) {
                    var width = 500;
                    var height = 500;
                    var viewport = page.getViewport(1);
                    var scale1 = width / viewport.width;
                    var scale2 = height / viewport.height;
                    var scale = (scale1 > scale2) ? scale1 : scale2;
                    var scaledViewport = page.getViewport(scale);
                    var canvas = document.getElementById('pdf_page_' + pageIndex);
                    canvas.width = scaledViewport.width;
                    canvas.height = scaledViewport.height;
                    var context = canvas.getContext('2d');
                    var renderContext = {
                        canvasContext: context,
                        viewport: scaledViewport
                    };
                    page.render(renderContext).then(function() {
                        ppa_page_loaded();
                    }, function() {
                        ppa_page_loaded();
                    });
                    canvas.style.width = ppa_zoom * canvas.width + 'px';
                    canvas.style.height = ppa_zoom * canvas.height + 'px';
                    ppa_redraw_page_rotation(pageIndex);
                });
            })();
        }
    }, function(reason) {
        ppa_close();
        if (reason == 'PasswordException: No password given') {
            message_box('Password required', '<p>The file is encrypted and needs a password for opening:</p><form onsubmit="message_box_close(); return false;"><input type="password" id="ppa_password" class="input_password input_password_big"></form>');
            message_box_callback = ppa_password_callback;
            document.getElementById('ppa_password').focus();
        } else if (reason == 'PasswordException: Incorrect Password') {
            message_box('Password wrong', '<p style="border: 1px solid #AA0000; color: #AA0000; padding: 5px; border-radius: 5px; font-weight: bold; margin-bottom: 20px;">The password is wrong.</p><p>Please enter the correct password:</p><form onsubmit="message_box_close(); return false;"><input type="password" id="ppa_password" class="input_password input_password_big"></form>');
            message_box_callback = ppa_password_callback;
            document.getElementById('ppa_password').focus();
        } else {
            message_box('Error', 'Unfortunately, the PDF page wizard is not available for the selected file.');
        }
    });
}

function ppa_password_callback() {
    ppa_load(ppa_file_box, ppa_file_index, ppa_mode_specific, document.getElementById('ppa_password').value);
}