require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview' ],
	function($yang, $com, $tree) {

		var HTML,
			KEYWORD_ROLE,
			KEYWORD_USER,
			KEYWORD_LIST_ROLE,
			KEYWORD_LIST_USER,
			FORMATTRT_ROLE,
			FORMATTRT_USER,
			model,
			DEFAULT_VALUE_ROLE,
			DEFAULT_VALUE_USER,
			TypeSource_ROLE,
			TypeSource_USER;


		HTML = {
			TreeItemNode : [
				'<li>',
				'<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />{{Text}}</span> ',
				'<ul>{{Items}}</ul>',
				'</li> ',

			].join(""),
			TableRoleItemNode : [
				'<tr data-color="">',
				'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
				'<td data-title="ID" data-value="{{ID}}">{{ID}}</td>',
				'<td data-title="Name" data-value="{{Name}}">{{Name}}</td>',
				'<td data-title="Active" data-value="{{Active}}">{{ActiveText}}</td>',
				'<td data-title="OwnerID" data-value="{{OwnerID}}">{{OwnerName}}</td>',
				'<td data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTimeText}}</td>',
				'<td data-title="Explain" data-value="{{Explain}}">{{Explain}}</td>',
				'</tr>',
			].join(""),
			TableRoleUserItemNode : [
				'<tr data-color="">',
				'<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
				'<td data-title="FunctionID" data-value="{{FunctionID}}">{{UserName}}</td>',
				'<td data-title="RoleID" data-value="{{RoleID}}">{{RoleName}}</td>',
				'</tr>',
			].join(""),
		};


		(function() {
			KEYWORD_LIST_ROLE = [
				"Name|权限名",
				"Explain|说明",
				"Active|状态|ArrayOne"
			];
			FORMATTRT_ROLE = {};
			KEYWORD_ROLE = {};
			DEFAULT_VALUE_ROLE = {
				Name : "",
				Explain : "",
				Active : true
			};

			TypeSource_ROLE = {
				Active : [ {
					name : "激活",
					value : true
				}, {
					name : "禁用",
					value : false
				} ],
			};
			$.each(KEYWORD_LIST_ROLE, function(i, item) {
				var detail = item.split("|");
				KEYWORD_ROLE[detail[0]] = {
					index : i,
					name : detail[1],
					type : detail.length > 2 ? detail[2] : undefined
				};
				if (detail.length > 2) {
					FORMATTRT_ROLE[detail[0]] = $com.util.getFormatter(TypeSource_ROLE, detail[0], detail[2]);
				}

			});



		})();

		(function() {
			KEYWORD_LIST_USER = [
				"FunctionID|用户名|Array"
			];

			KEYWORD_USER = {};
			FORMATTRT_USER = {};
			DEFAULT_VALUE_USER = {
				FunctionID : 0
			};
			TypeSource_USER = {
				FunctionID : []
			};
			$.each(KEYWORD_LIST_USER, function(i, item) {
				var detail = item.split("|");
				KEYWORD_USER[detail[0]] = {
					index : i,
					name : detail[1],
					type : detail.length > 2 ? detail[2] : undefined
				};
				if (detail.length > 2) {
					FORMATTRT_USER[detail[0]] = $com.util.getFormatter(TypeSource_USER, detail[0], detail[2]);
				}
			});
		})();

		model = $com.Model.create({
			name : 'iPlant.MES',

			type : $com.Model.MAIN,

			configure : function() {
				this.run();

			},

			events : function() {

				 


				function CheckTree($this) {
					var $Siblings = $this.parent('span').parent('li').parent('ul').children('li').children('span').children(".femi-tree-checkbox")

					var $parent_check = $this.parent('span').parent('li').parent('ul').prev('span').children(".femi-tree-checkbox");

					if ($this[0].checked) {

						var Is_all = true;
						$Siblings.each(function(i, item) {
							if (!item.checked)
								Is_all = false;
						});
						if (Is_all) {
							$parent_check.prop("checked", true);
							$parent_check.prop("indeterminate", false);
						} else {
							$parent_check.prop("checked", false);
							$parent_check.prop("indeterminate", true);
						}
					} else {

						var Is_all = true;
						$Siblings.each(function(i, item) {
							if (item.checked || $(item).prop("indeterminate"))
								Is_all = false;
						});
						$parent_check.prop("checked", false);
						if (Is_all) {
							$parent_check.prop("indeterminate", false);
						} else {
							$parent_check.prop("indeterminate", true);
						}
					}

					if ($parent_check[0])
						CheckTree($parent_check);
				}

				$("body").delegate("#roleTree .femi-tree-checkbox", "change", function() {

					var $this = $(this);


					var $own_check = $this.parent('span').next('ul').find(".femi-tree-checkbox");

					$own_check.prop("indeterminate", false);

					var $Siblings = $this.parent('span').parent('li').parent('ul').children('li').children('span').children(".femi-tree-checkbox")

					var $parent_check = $this.parent('span').parent('li').parent('ul').prev('span').children(".femi-tree-checkbox");

					if ($this[0].checked) {
						$own_check.prop("checked", true);
						var Is_all = true;
						$Siblings.each(function(i, item) {
							if (!item.checked)
								Is_all = false;
						});
						if (Is_all) {
							$parent_check.prop("checked", true);
							$parent_check.prop("indeterminate", false);
						} else {
							$parent_check.prop("checked", false);
							$parent_check.prop("indeterminate", true);
						}
					} else {
						$own_check.prop("checked", false);
						var Is_all = true;
						$Siblings.each(function(i, item) {
							if (item.checked || $(item).prop("indeterminate"))
								Is_all = false;
						});
						$parent_check.prop("checked", false);
						if (Is_all) {
							$parent_check.prop("indeterminate", false);
						} else {
							$parent_check.prop("indeterminate", true);
						}
					}

					if ($parent_check[0])
						CheckTree($parent_check);
				});


				$("body").delegate("#femi-add-role", "click", function() {
					$("body").append($com.modal.show(DEFAULT_VALUE_ROLE, KEYWORD_ROLE, "新增权限", function(rst) {
						//调用插入函数 

						if (!rst || $.isEmptyObject(rst))
							return;
						var _data = {
							Name : rst.Name,
							Explain : rst.Explain,
							Active : $com.util.boolean(rst.Active),
							ActiveText : "",
							CreateTime : new Date(),
						};
						model.com.saveRole({
							data : _data
						}, function(res) {
							if (res.info && res.info.ID) {


								res.info.ActiveText = res.info.Active ? "激活" : "禁用";
								res.info.CreateTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", res.info.CreateTime);

								model._RoleData.push(res.info);
								$("#femi-role-tbody").append($com.util.template(res.info, HTML.TableRoleItemNode));
								$("#femi-role-tbody tr").each(function (i, item) {
								    var $this = $(this);
								    var colorName = $this.css("background-color");
								    $this.attr("data-color", colorName);



								});
							}
						});

					}, TypeSource_ROLE));

				});


				$("body").delegate("#femi-edit-role", "click", function() {

					var _ids = $com.table.getSelectionTitle($("#femi-role-tbody"), "iD");

					if (!_ids || !_ids.length) {
						alert("请先选择一行数据再试！")
						return;
					}
					if (_ids.length != 1) {
						alert("只能同时对一行数据修改！")
						return;
					}
					var _index = $com.util.findIndex(model._RoleData,function(p){ return  p.ID == _ids[0]});
					if (_index < 0) {
						alert("待修改的数据不存在！")
						return;
					}

					var in_data = {
						Name : model._RoleData[_index].Name,
						Explain : model._RoleData[_index].Explain,
					};

					$("body").append($com.modal.show(in_data, KEYWORD_ROLE, "修改权限", function(rst) {
						//调用插入函数 

						if (!rst || $.isEmptyObject(rst))
							return;

						//model._RoleData[_index]
						var _data = $com.util.Clone(model._RoleData[_index]);
						_data.Name = rst.Name;
						_data.Explain = rst.Explain;

						model.com.saveRole({
							data : _data
						}, function(res) {
							if (res.info && res.info.ID) {
								res.info.ActiveText = res.info.Active ? "激活" : "禁用";
								res.info.CreateTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", res.info.CreateTime);

								model._RoleData[_index] = res.info;


								var $td = $("#femi-role-tbody").children('tr').children('td[data-title=iD][data-value=' + res.info.ID + ']');

								if ($td[0]) {
									SetTR(res.info, $td.parent("tr"), FORMATTRT_ROLE);
								}

							}
						});

					}, TypeSource_ROLE));

				});

				function SetTR(in_data, $tr, FORMATTRT) {
					for (var p in in_data) {
						var $td = $tr.children('td[data-title=' + p + ']');
						if (!$td[0]) {
							continue;
						}
						$td.siblings('td[data-title=name]').attr('data-value', in_data[p]);
						$td.siblings('td[data-title=name]').text((FORMATTRT && FORMATTRT[p]) ? FORMATTRT[p](in_data[p]) : in_data[p]);

					}
				}


				$("body").delegate("#femi-active-role", "click", function() {
					var _ids = $com.table.getSelectionTitle($("#femi-role-tbody"), "iD");

					if (!_ids || !_ids.length) {
						alert("请先选择一行数据再试！")
						return;
					}
					var Selection_Data = [];
					$.each(model._RoleData, function(i, item) {
						if ($.inArray(item.ID, _ids) < 0) {
							return true;
						}
						Selection_Data.push(item);

					});

					if (Selection_Data.length < 1) {
						alert("选择的数据不存在，请换一行数据再试！")
						return;
					}
					$(this).attr("disabled","true"); 
					setTimeout(function(){
						$(this).removeAttr("disabled"); 
					},3000); 
					model.com.activeRoleList({
						data : Selection_Data,
						active : 1
					}, function(res) {
						model.com.getRoleAll({}, function(res) {
							model.com.renderRole(res.list);
						});

					});

				});

				$("body").delegate("#femi-disable-role", "click", function() {
					var _ids = $com.table.getSelectionTitle($("#femi-role-tbody"), "iD");

					if (!_ids || !_ids.length) {
						alert("请先选择一行数据再试！")
						return;
					}
					var Selection_Data = [];
					$.each(model._RoleData, function(i, item) {
						if ($.inArray(item.ID, _ids) < 0) {
							return true;
						}
						Selection_Data.push(item);

					});

					if (Selection_Data.length < 1) {
						alert("选择的数据不存在，请换一行数据再试！")
						return;
					}
					$(this).attr("disabled","true"); 
					setTimeout(function(){
						$(this).removeAttr("disabled"); 
					},3000); 
					model.com.activeRoleList({
						data : Selection_Data,
						active : 0
					}, function(res) {
						model.com.getRoleAll({}, function(res) {
							model.com.renderRole(res.list);
						});

					});
				});

				$("body").delegate("#femi-add-user", "click", function() {
					$("body").append($com.modal.show(DEFAULT_VALUE_USER, KEYWORD_USER, "新增权限", function(rst) {
						//调用插入函数 

						if (!rst || $.isEmptyObject(rst))
							return;

						var _data = [].concat(model._RoleUserData);
						$.each(rst.FunctionID, function(i, item) {
							if (!item) {
								return true;
							}
							_data.push({
								FunctionID : item,
								RoleID : model._Role_ID,
								Text : ""
							});

						});
					 
						model.com.saveRoleUser({
							data : _data
						}, function(res) {
							model.com.getRoleUser({
								role_id : model._Role_ID
							}, function(resp) {

								model.com.renderRoleUser(resp.list, model._Role_Name, model._Role_ID);
							});
						});

					}, TypeSource_USER));
				});
				
				$("body").delegate("#femi-remove-user", "click", function() {

					var _ids = $com.table.getSelectionTitle($("#femi-role-user-tbody"), "FunctionID");

					if (!_ids || !_ids.length) {
						alert("请先选择一行数据再试！")
						return;
					}
					var Selection_Data = [];
					$.each(model._RoleUserData, function(i, item) {
						if ($.inArray(item.FunctionID, _ids) >= 0) {
							//选中的不添加 不保存   即选中的删除
							return true;
						}
						Selection_Data.push(item);

					});

					if (Selection_Data.length == model._RoleUserData.length) {
						alert("选择的数据不存在，请换一行数据再试！")
						return;
					}

					$(this).attr("disabled","true"); 
					setTimeout(function(){
						$(this).removeAttr("disabled"); 
					},2000); 
					
					model.com.saveRoleUser({
						data : Selection_Data
					}, function(res) {
						model.com.getRoleUser({
							role_id : model._Role_ID
						}, function(resp) {
							model.com.renderRoleUser(resp.list, model._Role_Name, model._Role_ID);
						});
					});
				});

				$("body").delegate("#femi-role-tbody tr", "dblclick", function() {
					var $this = $(this);
					if ($this.children('th')[0]) {
						return true;
					}


					var id = $this.children('td[data-title=iD]').html();

					if (!id || isNaN(id)) {
						return;
					}
					var name = $this.children('td[data-title=name]').html();

					var roleID = Number(id);
					model.com.getRoleSelect({
						role_id : roleID
					}, function(res) {
						model.com.renderTreeCheck(res.list);
					});
					model.com.getRoleUser({
						role_id : roleID
					}, function(res) {
						model.com.renderRoleUser(res.list, Name, roleID);
					});
				});


				function GetRoleItemByNode(RoleID) {
					var _rst = $com.util.find(model._RoleData,function(p){ return  p.ID == RoleID});
					return _rst;
				}
				function GetRoleUserItemByNode(FunctionID) {
					var _rst = $com.util.find(model._RoleUserData,function(p){ return  p.FunctionID == FunctionID});
					return _rst;
				}


				$("body").delegate("#femi-tree-update", "click", function() {

					var list = [];
					$("#roleTree li span input[type=checkbox].femi-tree-checkbox").each(function(i, item) {

						if (item.checked) { 
							list.push({
								FunctionID : Number($(item).val()),
								Text: $(item).text(),
								RoleID : model._Role_ID,
							});
						} 

					}); 
					$(this).attr("disabled","true"); 
					setTimeout(function(){
						$(this).removeAttr("disabled"); 
					},2000); 
					model.com.saveRoleSelect({
						data : list
					}, function(res) {
						alert("更新成功！");
					});
				});

			},

			run : function() {
				
			 
				model.com.getUserAll({Active:1}, function(res) {
					model._employee = res.list;
					 
				});
				/*	$(".femi-bd-half-left").css("width", "100%");*/

				model.com.getRoleTree({}, function(res) {
					model.com.renderTree(res.list)
					 
				});


				model.com.getRoleAll({}, function(res) {
					model.com.renderRole(res.list)
				 
					
				});
			},

			com : {
				getUserAll : function(data, fn, context) {
					var d = {
						$URI : "/User/All",
						$TYPE : "get"
					};

					function err() {
						$com.app.tip('获取失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},
				getRoleTree : function(data, fn, context) {
					var d = {
						$URI : "/Role/Tree",
						$TYPE : "get"
					};

					function err() {
						$com.app.tip('获取失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},
				getRoleAll : function(data, fn, context) {
					var d = {
						$URI : "/Role/All",
						$TYPE : "get"
					};

					function err() {
						$com.app.tip('获取失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},
				activeRoleList : function(data, fn, context) {
					var d = {
						$URI : "/Role/Active",
						$TYPE : "post"
					};

					function err() {
						$com.app.tip('提交失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},
				saveRole : function(data, fn, context) {
					var d = {
						$URI : "/Role/Update",
						$TYPE : "post"
					};

					function err() {
						$com.app.tip('提交失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},
				getRoleSelect : function(data, fn, context) {
					var d = {
						$URI : "/Role/Select",
						$TYPE : "get"
					};

					function err() {
						$com.app.tip('获取失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},
				saveRoleSelect : function(data, fn, context) {
					var d = {
						$URI : "/Role/UpdateSelect",
						$TYPE : "post"
					};

					function err() {
						$com.app.tip('提交失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},

				getRoleUser : function(data, fn, context) {
					var d = {
						$URI : "/Role/UserAll",
						$TYPE : "get"
					};

					function err() {
						$com.app.tip('获取失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},
				saveRoleUser : function(data, fn, context) {
					var d = {
						$URI : "/Role/UpdateUser",
						$TYPE : "post"
					};

					function err() {
						$com.app.tip('提交失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},

				renderRole : function(list) {


					$.each(list, function(i, item) {
						item.ActiveText = item.Active ? "激活" : "禁用";
						item.CreateTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", item.CreateTime);
					});
					model._RoleData = list;
					$(".femi-bd-half-right").hide();
					$("#select_role_lable").html("");
					$("#roleTree li span input[type=checkbox].femi-tree-checkbox").prop("checked", false);


					$("#femi-role-tbody").html($com.util.template(list, HTML.TableRoleItemNode));
					$("#femi-role-tbody").prev('thead').children('tr').children('th').children('input[type=checkbox].femi-tb-checkbox').prop("checked", false);
					$("#femi-role-tbody tr").each(function (i, item) {
					    var $this = $(this);
					    var colorName = $this.css("background-color");
					    $this.attr("data-color", colorName);



					});


				},


				renderRoleUser : function(list, roleName, role_ID) {

					var temp_source = [].concat(model._employee);

					$.each(list, function(i, item) {
						var _index = $com.util.findIndex(temp_source,function(p){ return  p.ID == item.FunctionID});
						if (_index < 0)
							return true;
						item.RoleName = roleName;
						item.UserName = temp_source[_index].Name;

						temp_source.splice(_index, 1);

					});

					TypeSource_USER.FunctionID.splice(0, TypeSource_USER.FunctionID.length);

					$.each(temp_source, function(s_i, s_item) {
						TypeSource_USER.FunctionID.push({
							name : s_item.Name,
							value : s_item.ID
						});
					});

					model._RoleUserData = list;
					model._Role_ID = role_ID;
					model._Role_Name = roleName;

					/*$("#role_user_head").html(roleName);*/
					if ($(".femi-bd-half-right").is(":hidden")) {
						$(".femi-bd-half-right").show();
					}

					$("#select_role_lable").html("当前选择:" + roleName);

					$("#femi-role-user-tbody ").html($com.util.template(list, HTML.TableRoleUserItemNode));
					$("#femi-role-user-tbody").prev('thead').children('tr').children('th').children('input[type=checkbox].femi-tb-checkbox').prop("checked", false);
					$("#femi-role-user-tbody tr").each(function (i, item) {
					    var $this = $(this);
					    var colorName = $this.css("background-color");
					    $this.attr("data-color", colorName);



					});

				},

				renderTree : function(list) {
					model._treeData = list;
					var _data = FindData(0);
					SetData(_data);

					tempData(_data);

					$("#roleTree").html($com.util.template(_data, HTML.TreeItemNode));

					$("#roleTree").treeview();

					function SetData(_in_data) {
						$.each(_in_data, function(_in_i, _item) {
							_item.items = FindData(_item.FunctionID);
							if (_item.items.length)
								SetData(_item.items);
						});

					}

					function FindData(wRoleID) {
						var _rst_Array = [];
						$.each(list, function(i, item) {
							if (wRoleID == item.RoleID) {
								_rst_Array.push(item);
							}
						});
						return _rst_Array;
					}
					;
					function tempData(_in_data_t) {
						$.each(_in_data_t, function(_in_i_t, _item_t) {
							_item_t.Items = '';
							if (_item_t.items.length) {
								tempData(_item_t.items);
								_item_t.Items = $com.util.template(_item_t.items, HTML.TreeItemNode)
							}
						});
					}

				},
				renderTreeCheck : function(list) {
					$("#roleTree li span input[type=checkbox].femi-tree-checkbox").prop("checked", false);
					$("#roleTree li span input[type=checkbox].femi-tree-checkbox").prop("indeterminate", false);
					$("#roleTree li span input[type=checkbox].femi-tree-checkbox").each(function(i, item) {
						var functionID = $(item).val();
						if (!functionID || isNaN(functionID)) {
							return true;
						}
						functionID = Number(functionID);

						var _index = $com.util.findIndex(list,function(p){ return  p.FunctionID == functionID});
						if (_index < 0) {
							/*$(item).prop("checked",false);*/
							return true;
						}
						$(item).prop("checked",true);
						$(item).change();

					});
				},
			}
		});

		model.init();
	});