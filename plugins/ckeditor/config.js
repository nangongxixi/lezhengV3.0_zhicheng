/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	//config.language = 'es';
	//config.uiColor = '#F2f2f2';
	config.height = 200;
	config.toolbarCanCollapse = true;
	config.image_previewText=' '; //预览区域显示内容  
	//config.filebrowserUploadUrl="http://www.liuyu.com/test.php";//图片上传接口
	//config.filebrowserUploadUrl="http://192.168.0.187/api/files/fileuploadforhaitang";//图片上传接口
	config.filebrowserUploadUrl="http://192.168.0.249:8080/api/files/fileuploadforhaitang";//图片上传接口
	//config.filebrowserImageUploadUrl = 'http://localhost/upload.php?type=img';
	//config.filebrowserFlashUploadUrl = 'http://localhost/upload.php?type=flash';
};

