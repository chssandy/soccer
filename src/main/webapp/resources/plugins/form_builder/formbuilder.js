(function() {
  rivets.binders.input = {
    publishes: true,
    routine: rivets.binders.value.routine,
    bind: function(el) {
      return $(el).bind('input.rivets', this.publish);
    },
    unbind: function(el) {
      return $(el).unbind('input.rivets');
    }
  };

  rivets.configure({
    prefix: "rv",
    adapter: {
      subscribe: function(obj, keypath, callback) {
        callback.wrapped = function(m, v) {
          return callback(v);
        };
        return obj.on('change:' + keypath, callback.wrapped);
      },
      unsubscribe: function(obj, keypath, callback) {
        return obj.off('change:' + keypath, callback.wrapped);
      },
      read: function(obj, keypath) {
        if (keypath === "cid") {
          return obj.cid;
        }
        return obj.get(keypath);
      },
      publish: function(obj, keypath, value) {
        if (obj.cid) {
          return obj.set(keypath, value);
        } else {
          return obj[keypath] = value;
        }
      }
    }
  });

  rivets.formatters.checked = function(value) {
    return value === "0";
  };

}).call(this);

(function() {
  var BuilderView, EditFieldView, FormBuilderModel, Formbuilder, FormbuilderCollection, ViewFieldView, _ref, _ref1, _ref2, _ref3, _ref4,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FormBuilderModel = (function(_super) {
    __extends(FormBuilderModel, _super);

    function FormBuilderModel() {
      _ref = FormBuilderModel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FormBuilderModel.prototype.sync = function() {};

    FormBuilderModel.prototype.indexInDOM = function() {
      var $wrapper,
        _this = this;
      $wrapper = $(".fb-field-wrapper").filter((function(_, el) {
        return $(el).data('cid') === _this.cid;
      }));
      return $(".fb-field-wrapper").index($wrapper);
    };

    FormBuilderModel.prototype.is_input = function() {
      return Formbuilder.inputFields[this.get(Formbuilder.options.mappings.FIELD_TYPE)] != null;
    };

    return FormBuilderModel;

  })(Backbone.DeepModel);

  FormbuilderCollection = (function(_super) {
    __extends(FormbuilderCollection, _super);

    function FormbuilderCollection() {
      _ref1 = FormbuilderCollection.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    FormbuilderCollection.prototype.initialize = function() {
      return this.on('add', this.copyCidToModel);
    };

    FormbuilderCollection.prototype.model = FormBuilderModel;

    FormbuilderCollection.prototype.comparator = function(model) {
      return model.indexInDOM();
    };

    FormbuilderCollection.prototype.copyCidToModel = function(model) {
      return model.attributes.cid = Formbuilder.curryCid()();
    };

    return FormbuilderCollection;

  })(Backbone.Collection);

  ViewFieldView = (function(_super) {
    __extends(ViewFieldView, _super);

    function ViewFieldView() {
      _ref2 = ViewFieldView.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    ViewFieldView.prototype.className = "fb-field-wrapper";

    ViewFieldView.prototype.events = {
      'click .subtemplate-wrapper': 'focusEditView',
      'click .js-duplicate': 'duplicate',
      'click .js-clear': 'clear'
    };

    ViewFieldView.prototype.initialize = function(options) {
      this.parentView = options.parentView;
      this.listenTo(this.model, "change", this.render);
      return this.listenTo(this.model, "destroy", this.remove);
    };

    ViewFieldView.prototype.render = function() {
      this.$el.addClass('response-field-' + this.model.get(Formbuilder.options.mappings.FIELD_TYPE)).data('cid', this.model.cid).empty().html(Formbuilder.templates["view/base" + (!this.model.is_input() ? '_non_input' : '')]({
        rf: this.model
      }));
      return this;
    };

    ViewFieldView.prototype.focusEditView = function() {
      return this.parentView.createAndShowEditView(this.model);
    };

    ViewFieldView.prototype.clear = function(e) {
      var cb, x,
        _this = this;
      e.preventDefault();
      e.stopPropagation();
      cb = function() {
        _this.parentView.handleFormUpdate();
        _this.parentView.clearLogicSetting(_this.model.get("cid"));
        return _this.model.destroy();
      };
      x = Formbuilder.options.CLEAR_FIELD_CONFIRM;
      switch (typeof x) {
        case 'string':
          if (confirm(x)) {
            return cb();
          }
          break;
        case 'function':
          return x(cb);
        default:
          return cb();
      }
    };

    ViewFieldView.prototype.duplicate = function() {
      var attrs;
      attrs = _.clone(this.model.attributes);
      delete attrs['id'];
      attrs['label'] += ' Copy';
      return this.parentView.createField(attrs, {
        position: this.model.indexInDOM() + 1
      });
    };

    return ViewFieldView;

  })(Backbone.View);

  EditFieldView = (function(_super) {
    __extends(EditFieldView, _super);

    function EditFieldView() {
      _ref3 = EditFieldView.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    EditFieldView.prototype.className = "edit-response-field";

    EditFieldView.prototype.events = {
      'click .js-add-option': 'addOption',
      'click .js-remove-option': 'removeOption',
      'click .js-default-updated': 'defaultUpdated',
      'input .option-label-input': 'forceRender',
      'click .img-remove': 'removeImg'
    };

    EditFieldView.prototype.initialize = function(options) {
      this.parentView = options.parentView;
      return this.listenTo(this.model, "destroy", this.remove);
    };

    EditFieldView.prototype.render = function() {
      this.$el.html(Formbuilder.templates["edit/base" + (!this.model.is_input() ? '_non_input' : '')]({
        rf: this.model
      }));
      rivets.bind(this.$el, {
        model: this.model
      });
      return this;
    };

    EditFieldView.remove = function() {
      this.parentView.editView = void 0;
      return EditFieldView.__super__.constructor.remove.apply(this, arguments);
    };

    EditFieldView.prototype.addOption = function(e) {
      var $el, i, newOption, options, type;
      $el = $(e.currentTarget);
      i = this.$el.find('.option').index($el.closest('.option'));
      type = this.model.get(Formbuilder.options.mappings.FIELD_TYPE);
      if (type === "photo") {
        newOption = {
          label: ""
        };
      } else {
        newOption = {
          label: "",
          checked: false
        };
      }
      options = this.model.get(Formbuilder.options.mappings.OPTIONS) || [];
      if (i > -1) {
        options.splice(i + 1, 0, newOption);
      } else {
        options.push(newOption);
      }
      this.model.set(Formbuilder.options.mappings.OPTIONS, options);
      this.model.trigger("change:" + Formbuilder.options.mappings.OPTIONS);
      return this.forceRender();
    };

    EditFieldView.prototype.removeOption = function(e) {
      var $el, index, options;
      $el = $(e.currentTarget);
      index = this.$el.find(".js-remove-option").index($el);
      options = this.model.get(Formbuilder.options.mappings.OPTIONS);
      if (options[index]) {
        options.splice(index, 1);
      }
      this.model.set(Formbuilder.options.mappings.OPTIONS, options);
      this.model.trigger("change:" + Formbuilder.options.mappings.OPTIONS);
      return this.forceRender();
    };

    EditFieldView.prototype.removeImg = function(e) {
      var $el;
      $el = $(e.currentTarget);
      if ($el.data("counter") === "single") {
        this.model.unset(Formbuilder.options.mappings.IMG_URL);
      }
      if ($el.data("counter") === "single_code") {
        this.model.unset(Formbuilder.options.mappings.IMG_URL);
        return this.model.unset(Formbuilder.options.mappings.CODE_IMG);
      }
    };

    EditFieldView.prototype.defaultUpdated = function(e) {
      var $el;
      $el = $(e.currentTarget);
      if (this.model.get(Formbuilder.options.mappings.FIELD_TYPE) !== 'checkboxes') {
        this.$el.find(".js-default-updated").not($el).attr('checked', false).trigger('change');
      }
      return this.forceRender();
    };

    EditFieldView.prototype.forceRender = function() {
      return this.model.trigger('change');
    };

    return EditFieldView;

  })(Backbone.View);

  BuilderView = (function(_super) {
    __extends(BuilderView, _super);

    function BuilderView() {
      _ref4 = BuilderView.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    BuilderView.prototype.SUBVIEWS = [];

    BuilderView.prototype.editViewCache = {};

    BuilderView.prototype.events = {
      'click .fb-edit-add a': 'addField'
    };

    BuilderView.prototype.initialize = function(options) {
      var logic_btn, selector, uniqueId,
        _this = this;
      selector = options.selector, logic_btn = options.logic_btn, this.formBuilder = options.formBuilder, this.bootstrapData = options.bootstrapData;
      if (selector != null) {
        this.setElement($(selector));
      }
      if (logic_btn) {
        $(logic_btn).on("click", $.proxy(this.loadLogicSetting, this));
      }
      this.collection = new FormbuilderCollection;
      this.collection.bind('add', this.addOne, this);
      this.collection.bind('reset', this.reset, this);
      this.collection.bind('change', this.handleFormUpdate, this);
      this.collection.bind('destroy add reset', this.hideShowNoResponseFields, this);
      this.render();
      this.collection.reset(this.bootstrapData);
      if (this.collection.length) {
        uniqueId = Formbuilder.curryCid();
        this.collection.each(function(ele) {
          return uniqueId(ele.get("cid"));
        });
        uniqueId();
      }
      $("[data-spy='affix']").affix({
        offset: {
          top: 100
        }
      });
      return this.bindLogicSettingEvents();
    };

    BuilderView.prototype.reset = function() {
      this.$responseFields.html('');
      return this.addAll();
    };

    BuilderView.prototype.render = function() {
      this.$el.html(Formbuilder.templates['page']());
      this.$responseFields = this.$el.find('.fb-response-fields');
      this.hideShowNoResponseFields();
      return this;
    };

    BuilderView.prototype.addOne = function(responseField, _, options) {
      var $replacePosition, view;
      view = new ViewFieldView({
        model: responseField,
        parentView: this
      });
      if (options.$replaceEl != null) {
        return options.$replaceEl.replaceWith(view.render().el);
      } else if ((options.position == null) || options.position === -1) {
        return this.$responseFields.append(view.render().el);
      } else if (options.position === 0) {
        return this.$responseFields.prepend(view.render().el);
      } else if (($replacePosition = this.$responseFields.find(".fb-field-wrapper").eq(options.position))[0]) {
        return $replacePosition.before(view.render().el);
      } else {
        return this.$responseFields.append(view.render().el);
      }
    };

    BuilderView.prototype.setSortable = function() {
      var _this = this;
      if (this.$responseFields.hasClass('ui-sortable')) {
        this.$responseFields.sortable('destroy');
      }
      this.$responseFields.sortable({
        forcePlaceholderSize: true,
        placeholder: 'sortable-placeholder',
        stop: function(e, ui) {
          var rf;
          if (ui.item.data('field-type')) {
            rf = _this.collection.create(Formbuilder.helpers.defaultFieldAttrs(ui.item.data('field-type')), {
              $replaceEl: ui.item
            });
            _this.createAndShowEditView(rf);
          }
          _this.handleFormUpdate();
          return true;
        },
        update: function(e, ui) {}
      });
      return this.setDraggable();
    };

    BuilderView.prototype.setDraggable = function() {
      var $addFieldButtons,
        _this = this;
      $addFieldButtons = this.$el.find("[data-field-type]");
      return $addFieldButtons.draggable({
        connectToSortable: this.$responseFields,
        helper: function() {
          var $helper;
          $helper = $("<div class='response-field-draggable-helper' />");
          $helper.css({
            width: _this.$responseFields.width(),
            height: '80px'
          });
          return $helper;
        }
      });
    };

    BuilderView.prototype.addAll = function() {
      this.collection.each(this.addOne, this);
      return this.setSortable();
    };

    BuilderView.prototype.hideShowNoResponseFields = function() {
      return this.$el.find(".fb-no-response-fields")[this.collection.length > 0 ? 'hide' : 'show']();
    };

    BuilderView.prototype.addField = function(e) {
      var field_type;
      field_type = $(e.currentTarget).data('field-type');
      return this.createField(Formbuilder.helpers.defaultFieldAttrs(field_type));
    };

    BuilderView.prototype.createField = function(attrs, options) {
      var rf;
      rf = this.collection.create(attrs, options);
      this.createAndShowEditView(rf);
      return this.handleFormUpdate();
    };

    BuilderView.prototype.createAndShowEditView = function(model) {
      var $newEditEl, $responseFieldEl, currentWrapper, editView;
      $responseFieldEl = this.$el.find(".fb-field-wrapper").filter(function() {
        return $(this).data('cid') === model.cid;
      });
      $responseFieldEl.addClass('editing').siblings('.fb-field-wrapper').removeClass('editing');
      currentWrapper = this.$el.find(".fb-edit-field-wrapper");
      if (currentWrapper.data("view_id") === model.cid) {
        this.scrollLeftWrapper($responseFieldEl);
        return;
      } else {
        if (this.editViewCache[model.cid]) {
          $newEditEl = this.editViewCache[model.cid];
        } else {
          editView = new EditFieldView({
            model: model,
            parentView: this
          });
          $newEditEl = editView.render().$el;
        }
      }
      this.editViewCache[currentWrapper.data("view_id")] = currentWrapper.find(".edit-response-field").detach();
      currentWrapper.data("view_id", model.cid).css('display', 'none').append($newEditEl).fadeIn();
      if (!this.editViewCache[model.cid]) {
        this.bindImgUploadEvent(model);
      }
      this.scrollLeftWrapper($responseFieldEl);
      return this;
    };

    BuilderView.prototype.bindImgUploadEvent = function(model) {
      var _this = this;
      Uploader({
        contextPath: WEB_URL,
        upload_url: SERVER_URL + '/system/public/uploadImage/subject',
        button_placeholder_id: "imgUp_route_btn",
        success_callback: $.proxy(function(up, file, serverData) {
          var copyOf_options, data, options;
          data = $.parseJSON(serverData.response).data;
          if (data.state === 'SUCCESS' && data.file0) {
            if (_this.option_index > -1) {
              options = model.get(Formbuilder.options.mappings.OPTIONS);
              copyOf_options = $.extend(true, [], options);
              copyOf_options[_this.option_index].img_url = data.file0.url;
              model.set(Formbuilder.options.mappings.OPTIONS, copyOf_options);
            }
            if (_this.option_index === -1) {
              return model.set(Formbuilder.options.mappings.IMG_URL, data.file0.url);
            }
          }
        }, this),
        fileDialogCompleteFun: $.proxy(function(up, files) {
          var copyOf_options;
          if (_this.option_index > -1) {
            copyOf_options = $.extend(true, [], model.get(Formbuilder.options.mappings.OPTIONS));
            copyOf_options[_this.option_index].img_url = WEB_URL + "/resource/images/loading.gif";
            model.set(Formbuilder.options.mappings.OPTIONS, copyOf_options);
          } else if (_this.option_index === -1) {
            model.set(Formbuilder.options.mappings.IMG_URL, WEB_URL + "/resource/images/loading.gif");
          }
          return up.start();
        }, this)
      });
      $("#img-ups").on("click", ".img_upload_btn", function(e) {
        var $this, btn;
        $this = $(e.target);
        if ($this.data("counter") === "single") {
          _this.option_index = -1;
        } else {
          _this.option_index = $("#img-ups").find('.option').index($this.closest('.option'));
        }
        btn = $("#imgUp_route_btn");
        return !!btn && btn.click();
      });
      UploaderFile({
        contextPath: WEB_URL,
        upload_url: SERVER_URL + '/system/public/uploadFile/subject',
        button_placeholder_id: "btn_uploadFile",
        extensions: "mp4,avi,mov",
        success_callback: $.proxy(function(up, file, serverData) {
          var data;
          data = $.parseJSON(serverData.response).data;
          if (data.state === 'SUCCESS' && data.file0) {
            return model.set(Formbuilder.options.mappings.VIDEO_URL, data.file0.url);
          }
        }, this)
      });
      return Uploader({
        contextPath: WEB_URL,
        upload_url: SERVER_URL + '/system/public/checkUploadImage/subject',
        button_placeholder_id: "codeUp_btn",
        success_callback: $.proxy(function(up, file, serverData) {
          var data;
          data = $.parseJSON(serverData.response).data;
          if (data.state === 'SUCCESS' && data.file0 && data.file0.content) {
            model.set(Formbuilder.options.mappings.CODE_IMG, data.file0.content, {
              silent: true
            });
            return model.set(Formbuilder.options.mappings.IMG_URL, data.file0.url);
          } else {
            return alert("该图片不能被识别，请重新上传！");
          }
        }, this),
        fileDialogCompleteFun: function(up, files) {
          model.set(Formbuilder.options.mappings.IMG_URL, WEB_URL + "/resource/images/loading.gif");
          return up.start();
        }
      });
    };

    BuilderView.prototype.scrollLeftWrapper = function($responseFieldEl) {
      var _this = this;
      if (!$responseFieldEl[0]) {
        return;
      }
      return $.scrollWindowTo((this.$el.offset().top + $responseFieldEl.offset().top) - this.$responseFields.offset().top, 200, function() {});
    };

    BuilderView.prototype.handleFormUpdate = function() {};

    BuilderView.prototype.LogicData = function() {
      var _all, _unsettled,
        _this = this;
      _all = [];
      _unsettled = {};
      this.set = function(collection) {
        if (collection.length) {
          return collection.each(function(ele) {
            var a, index, o, opt, optArr, options, _i, _len, _obj;
            o = {
              cid: ele.get("cid"),
              label: ele.get(Formbuilder.options.mappings.LABEL)
            };
            a = [];
            optArr = void 0;
            if (ele.get(Formbuilder.options.mappings.FIELD_TYPE) === "radio") {
              options = ele.get(Formbuilder.options.mappings.OPTIONS);
              optArr = [];
              for (index = _i = 0, _len = options.length; _i < _len; index = ++_i) {
                opt = options[index];
                if (!opt.skipto) {
                  optArr.push(index);
                }
                a.push(index);
              }
            }
            if (!ele.get(Formbuilder.options.mappings.LOGIC_LINKTO)) {
              _obj = {
                label: ele.get(Formbuilder.options.mappings.LABEL)
              };
              if (optArr && optArr.length > 0) {
                _obj.optUnset = optArr;
              }
              if (optArr === void 0 || optArr.length !== 0) {
                _unsettled[ele.get("cid")] = _obj;
              }
            }
            a.length > 0 && (o.options = a);
            return _all.push(o);
          });
        }
      };
      this.add = function(obj) {
        var ele, index, unset, _i, _len;
        switch (typeof obj) {
          case "string":
            return delete _unsettled[obj];
          case "object":
            unset = _unsettled[obj.cid].optUnset;
            if (unset && unset.length) {
              for (index = _i = 0, _len = unset.length; _i < _len; index = ++_i) {
                ele = unset[index];
                if (ele === obj.index) {
                  unset.splice(index, 1);
                }
              }
            }
            if (unset.length <= 0) {
              return delete _unsettled[obj.cid];
            }
            break;
        }
      };
      this.remove = function(obj) {
        var index, x, _i, _len, _results;
        if (obj.index != null) {
          if (!_unsettled[obj.cid] || !_unsettled[obj.cid].optUnset) {
            return _unsettled[obj.cid] = {
              optUnset: [obj.index]
            };
          } else {
            return _unsettled[obj.cid].optUnset.push(obj.index);
          }
        } else {
          _unsettled[obj.cid] = {
            label: obj.label
          };
          _results = [];
          for (index = _i = 0, _len = _all.length; _i < _len; index = ++_i) {
            x = _all[index];
            if (x.cid === obj.cid && x.options) {
              _results.push(_unsettled[obj.cid].optUnset = x.options);
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      };
      this.nextAll = function(cid) {
        var index, x, _i, _len;
        if (cid) {
          for (index = _i = 0, _len = _all.length; _i < _len; index = ++_i) {
            x = _all[index];
            if (x.cid === cid) {
              return _all.slice(index + 1);
            }
          }
        }
      };
      this.getUnsettled = function() {
        var e, l, _i, _len;
        l = [];
        for (_i = 0, _len = _all.length; _i < _len; _i++) {
          e = _all[_i];
          if (_unsettled.hasOwnProperty(e.cid)) {
            l.push(e);
          }
        }
        return l;
      };
      this.getUnsettledObj = function() {
        return _unsettled;
      };
      return this;
    };

    BuilderView.prototype.bindLogicSettingEvents = function() {
      var _this = this;
      $("#logic_setting").on("change", ".c_q", $.proxy(function(e) {
        var $this, co, current, currentWrapper, current_options, index, jq, nextall, o, _i, _j, _len, _len1, _ref5;
        $this = $(e.target);
        currentWrapper = $this.closest(".logic_wrapper");
        co = currentWrapper.find(".c_o");
        co.children().not("option[value='-1']").remove();
        co.prop("disabled", $this.val() === "-1").trigger("change");
        if ($this.val() !== "-1") {
          current = _this.cgetAdapter($this.val());
        }
        if (current) {
          if (current.get(Formbuilder.options.mappings.FIELD_TYPE) === "radio") {
            current_options = current.get(Formbuilder.options.mappings.OPTIONS);
            o = _this.ld.getUnsettledObj()[current.get("cid")];
            _ref5 = o.optUnset;
            for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
              index = _ref5[_i];
              current_options[index] && _this.optionRender(co, index, current_options[index].label);
            }
            if (o.optUnset.length === current_options.length) {
              _this.optionRender(co, "-2", "显示");
            }
            currentWrapper.find(".lb").show();
          } else {
            currentWrapper.find(".lb").hide();
            _this.optionRender(co, "-2", "显示");
          }
          jq = currentWrapper.find(".j_q");
          jq.children().not("option[value='-1']").remove();
          nextall = _this.ld.nextAll($this.val());
          for (_j = 0, _len1 = nextall.length; _j < _len1; _j++) {
            e = nextall[_j];
            _this.optionRender(jq, e.cid, e.label);
          }
          return _this.optionRender(jq, "-3", "结束");
        }
      }, this));
      $("#logic_setting").on("change", ".c_o", $.proxy(function(e) {
        var $this;
        $this = $(e.target);
        return $this.closest(".logic_wrapper").find(".j_q").prop("disabled", $this.val() === "-1" || !$this.val());
      }, this));
      $("#logic_setting").on("change", ".j_q", function(e) {
        var $this, cid, model, optIndex, options, selects;
        $this = $(e.target);
        if ($this.val() !== "-1") {
          selects = $this.closest(".logic_wrapper").find("select").prop("disabled", true);
          cid = selects.filter(".c_q").val();
          optIndex = parseInt(selects.filter(".c_o").val(), 10);
          model = _this.collection.findWhere({
            cid: cid
          });
          if (optIndex === -2) {
            _this.ld.add(cid);
            model.set({
              skipto: $this.val()
            }, {
              silent: true
            });
          } else {
            _this.ld.add({
              cid: cid,
              index: optIndex
            });
            options = model.get(Formbuilder.options.mappings.OPTIONS);
            options[optIndex].skipto = $this.val();
          }
          return $("#logic_setting .fb-logic-add").show();
        }
      });
      $("#logic_setting").on("click", ".fb-logic-add", function(e) {
        var cq, unset, _i, _len, _results;
        $(e.target).hide();
        cq = $("#logic_setting").find(".hide").clone().removeClass("hide").insertBefore($("#add_logic_btn")).find(".c_q");
        cq.prop("disabled", false);
        if (_this.ld && (unset = _this.ld.getUnsettled())) {
          _results = [];
          for (_i = 0, _len = unset.length; _i < _len; _i++) {
            e = unset[_i];
            _results.push(_this.optionRender(cq, e.cid, e.label));
          }
          return _results;
        }
      });
      $("#logic_setting").on("click", ".fb-logic-remove", function(e) {
        var $d, cid, isIndex, model, options, wrapper;
        wrapper = $(e.target).closest(".logic_wrapper");
        $d = wrapper.find(".c_q");
        cid = $d.val();
        model = _this.collection.findWhere({
          cid: cid
        });
        if ($d.prop("disabled")) {
          isIndex = wrapper.find(".c_o").val();
          if (isIndex === "-2") {
            _this.ld.remove({
              cid: cid,
              label: $d.find("option:selected").text()
            });
            model.unset(Formbuilder.options.mappings.LOGIC_LINKTO, {
              silent: true
            });
          } else {
            _this.ld.remove({
              cid: cid,
              index: parseInt(isIndex, 10),
              label: $d.find("option:selected").text()
            });
            options = model.get(Formbuilder.options.mappings.OPTIONS);
            delete options[isIndex]["skipto"];
          }
        }
        wrapper.remove();
        return $("#logic_setting .fb-logic-add").show();
      });
      return $("#logic_setting").on("mouseover", ".fb-logic-info", function(e) {
        var $this;
        $this = $(e.target);
        return $this.attr("title", $this.closest("div.form-group").find("select").find("option:selected").text());
      });
    };

    BuilderView.prototype.loadLogicSetting = function() {
      var logic_original,
        _this = this;
      $("#logic_setting").find(".logic_wrapper").not(".hide").remove();
      this.ld = new this.LogicData();
      if (this.collection.length > 0) {
        $("#logic_setting").find(".fb-logic-add").show();
        this.collection.sort();
        this.ld.set(this.collection);
        logic_original = $("#logic_setting").find(".hide");
        return this.collection.each(function(ele) {
          var linkto, logic_clone, options;
          linkto = ele.get(Formbuilder.options.mappings.LOGIC_LINKTO);
          if (linkto) {
            logic_clone = logic_original.clone();
            _this.optionRender(logic_clone.find(".c_q").empty(), ele.get("cid"), ele.get(Formbuilder.options.mappings.LABEL));
            _this.optionRender(logic_clone.find(".c_o").empty(), "-2", "显示");
            _this.optionRender(logic_clone.find(".j_q").empty(), linkto, linkto === "-3" ? "结束" : _this.cgetAdapter(linkto).get(Formbuilder.options.mappings.LABEL));
            return logic_clone.removeClass("hide").insertBefore($("#add_logic_btn")).find(".lb").hide();
          } else if (ele.get(Formbuilder.options.mappings.FIELD_TYPE) === "radio") {
            options = ele.get(Formbuilder.options.mappings.OPTIONS);
            return $.each(options, function(index, e) {
              if (!!e.skipto) {
                logic_clone = logic_original.clone();
                _this.optionRender(logic_clone.find(".c_q").empty(), ele.get("cid"), ele.get(Formbuilder.options.mappings.LABEL));
                _this.optionRender(logic_clone.find(".c_o").empty(), index, e.label);
                _this.optionRender(logic_clone.find(".j_q").empty(), e.skipto, e.skipto === "-3" ? "结束" : _this.cgetAdapter(e.skipto).get(Formbuilder.options.mappings.LABEL));
                return logic_clone.removeClass("hide").insertBefore($("#add_logic_btn"));
              }
            });
          }
        });
      }
    };

    BuilderView.prototype.optionRender = function(selectDom, value, text) {
      selectDom.append("<option value='" + value + "'>" + text + "</option>");
      return selectDom;
    };

    BuilderView.prototype.clearLogicSetting = function(cid) {
      var _this = this;
      return this.collection.each(function(ele) {
        var options, skipto;
        skipto = ele.get(Formbuilder.options.mappings.LOGIC_LINKTO);
        if (skipto && cid === skipto) {
          ele.unset(Formbuilder.options.mappings.LOGIC_LINKTO, {
            silent: true
          });
        }
        if (ele.get(Formbuilder.options.mappings.FIELD_TYPE) === "radio") {
          options = ele.get(Formbuilder.options.mappings.OPTIONS);
          return $.each(options, function(index, e) {
            if (e.skipto && e.skipto === cid) {
              delete e.skipto;
            }
            return true;
          });
        }
      });
    };

    BuilderView.prototype.cgetAdapter = function(cid) {
      var m,
        _this = this;
      if (!!cid) {
        m = {};
        this.collection.each(function(ele) {
          if (ele.get("cid") === cid) {
            m = ele;
            return false;
          }
        });
        return m;
      }
    };

    return BuilderView;

  })(Backbone.View);

  Formbuilder = (function() {
    Formbuilder.helpers = {
      defaultFieldAttrs: function(field_type) {
        var attrs, _base;
        attrs = {};
        attrs[Formbuilder.options.mappings.LABEL] = '';
        attrs[Formbuilder.options.mappings.FIELD_TYPE] = field_type;
        attrs[Formbuilder.options.mappings.REQUIRED] = true;
        return (typeof (_base = Formbuilder.fields[field_type]).defaultAttributes === "function" ? _base.defaultAttributes(attrs) : void 0) || attrs;
      },
      simple_format: function(x) {
        return x != null ? x.replace(/\n/g, '<br />') : void 0;
      }
    };

    Formbuilder.options = {
      SAVE_BTN: '#fb-button',
      LOGIC_SETTING_BTN: "#logic_setting",
      CLEAR_FIELD_CONFIRM: false,
      mappings: {
        LABEL: 'label',
        FIELD_TYPE: 'field_type',
        DESCRIPTION: 'descript',
        REQUIRED: 'required',
        OPTIONS: 'options',
        INCLUDE_ANSWER_RULES: 'include_answer_rules',
        ANSWER_RULES: 'answer_rules',
        INCLUDE_OTHER: 'include_other_option',
        IMG_URL: "img_url",
        VIDEO_URL: "video_url",
        LOGIC_LINKTO: "skipto",
        EXECUTE_RULE: "execute_rule",
        CODE_IMG: "execute_img"
      }
    };

    Formbuilder.fields = {};

    Formbuilder.inputFields = {};

    Formbuilder.curryCid = function() {
      var _seeds;
      _seeds = [];
      return function() {
        if (arguments.length === 0) {
          if (_seeds.length) {
            this.baseSeed = Math.max.apply(null, _seeds);
            return _seeds.length = 0;
          } else {
            this.baseSeed || (this.baseSeed = Math.floor(Math.random() * 10 + 1));
            return "c" + (this.baseSeed = this.baseSeed + 5);
          }
        } else {
          return /^c\d+/.test(arguments[0]) && _seeds.push(parseInt(arguments[0].replace("c", 0), 10));
        }
      };
    };

    Formbuilder.registerField = function(name, opts) {
      var x, _i, _len, _ref5;
      _ref5 = ['view', 'edit'];
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        x = _ref5[_i];
        opts[x] = _.template(opts[x]);
      }
      opts.field_type = name;
      Formbuilder.fields[name] = opts;
      return Formbuilder.inputFields[name] = opts;
    };

    Formbuilder.prototype.getFormJson = function() {
      return this.mainView.collection.sort().toJSON();
    };

    function Formbuilder(opts) {
      var args;
      if (opts == null) {
        opts = {};
      }
      _.extend(this, Backbone.Events);
      args = _.extend(opts, {
        formBuilder: this
      });
      this.mainView = new BuilderView(args);
    }

    return Formbuilder;

  })();

  window.Formbuilder = Formbuilder;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Formbuilder;
  } else {
    window.Formbuilder = Formbuilder;
  }

}).call(this);

(function() {
  Formbuilder.registerField('barcode', {
    order: 7,
    name: "条形码题",
    view: "<input type=\"text\" >",
    edit: "<%= Formbuilder.templates['edit/barcode']() %>",
    addButton: "<i class=\"fa fa-barcode\"></i> 条形码",
    defaultAttributes: function(attrs) {
      attrs.execute_rule = "0";
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('checkboxes', {
    order: 1,
    name: "多选题",
    view: "<div class='img-a'>\n  <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n    <div class=\"img-d\">\n      <span class='fb-option'>\n        <input type='checkbox' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n        <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n      </span>\n      <% if (rf.get(Formbuilder.options.mappings.OPTIONS)[i].img_url) { %>\n          <img src='<%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].img_url %>' />\n      <% } %>\n    </div>\n  <% } %>\n</div>",
    edit: "<%= Formbuilder.templates['edit/options']({ includeOther: true }) %>",
    addButton: "<i class=\"fa fa-check-square-o\"></i> 多选框",
    defaultAttributes: function(attrs) {
      attrs.options = [
        {
          label: "",
          checked: false
        }, {
          label: "",
          checked: false
        }
      ];
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('photo', {
    order: 4,
    name: "图片题",
    view: "<div class='img-a'>\n   <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n      <div class='img-d'>\n          <img src='<%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].img_url %>' />\n          <span><%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %> </span>\n      </div>\n    <% } %>\n</div>",
    edit: "<%= Formbuilder.templates['edit/multi_img_upload']() %>",
    addButton: "<i class=\"fa fa-camera\"></i> 图片题",
    defaultAttributes: function(attrs) {
      attrs.execute_rule = 0;
      attrs.options = [
        {
          label: "图片标题"
        }
      ];
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('position', {
    order: 3,
    name: "定位题",
    view: "<textarea></textarea>",
    edit: "<%= Formbuilder.templates['edit/picture']() %>",
    addButton: "<i class=\"fa fa-map-marker\"></i> 定位题",
    defaultAttributes: function(attrs) {
      attrs.img_url = "";
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('qrcode', {
    order: 8,
    name: "二维码题",
    view: "<input type=\"text\" >",
    edit: "<%= Formbuilder.templates['edit/qrcode']() %>",
    addButton: "<i class=\"fa fa-qrcode\"></i> 二维码",
    defaultAttributes: function(attrs) {
      attrs.execute_rule = "0";
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('radio', {
    order: 0,
    name: "单选题",
    view: "<div class='img-a'>\n  <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n    <div class=\"img-d\">\n      <span class='fb-option'>\n        <input type='radio' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n        <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n      </span>\n      <% if (rf.get(Formbuilder.options.mappings.OPTIONS)[i].img_url)  { %>\n          <img src=\"<%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].img_url %>\" >\n      <% } %>\n    </div>\n  <% } %>\n</div>",
    edit: "<%= Formbuilder.templates['edit/options']({ includeOther: true }) %>",
    addButton: "<i class=\"fa fa-dot-circle-o\"></i> 单选题",
    defaultAttributes: function(attrs) {
      attrs.options = [
        {
          label: "",
          checked: false
        }, {
          label: "",
          checked: false
        }
      ];
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('text', {
    order: 2,
    name: "文本题",
    view: "<input type='text'  />",
    edit: "<%= Formbuilder.templates['edit/answer_rules']() %>\n<%= Formbuilder.templates['edit/picture']() %>",
    addButton: "<i class=\"fa fa-pencil-square\"></i> 文本题",
    defaultAttributes: function(attrs) {
      attrs.img_url = "";
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('video', {
    order: 5,
    name: "视频题",
    view: "<input type=\"text\" >",
    edit: "<%= Formbuilder.templates['edit/video']() %>",
    addButton: "<i class=\"fa fa-video-camera\"></i> 视频题",
    defaultAttributes: function(attrs) {
      return attrs;
    }
  });

}).call(this);

this["Formbuilder"] = this["Formbuilder"] || {};
this["Formbuilder"]["templates"] = this["Formbuilder"]["templates"] || {};

this["Formbuilder"]["templates"]["edit/answer_rules"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="form-group" >\r\n    <div>\r\n        <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_ANSWER_RULES )) == null ? '' : __t) +
'\' /> 答案格式\r\n    </div>\r\n    <div data-rv-if="model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_ANSWER_RULES )) == null ? '' : __t) +
'">\r\n        <select class="form-control" data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.ANSWER_RULES )) == null ? '' : __t) +
'">\r\n            <option value="-1">请选择</option>\r\n            <option value="^\\d+$">数值</option>\r\n            <option value="date">日期</option>\r\n            <option value="^1\\d{10}$">手机号</option>\r\n            <option value="^(\\w)+(\\.\\w+)*@(\\w)+((\\.\\w+)+)$">邮箱</option>\r\n        </select>\r\n    </div>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/barcode"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<button class="hide" id="imgUp_route_btn"></button>\r\n<div class="form-group">\r\n    <label class="radio-inline">\r\n        <input type="radio" name="execute_rule" data-rv-checked="model.' +
((__t = (Formbuilder.options.mappings.EXECUTE_RULE )) == null ? '' : __t) +
'" value="0" />条形码信息校验\r\n    </label>\r\n    <label class="radio-inline">\r\n        <input type="radio" name="execute_rule" data-rv-checked="model.' +
((__t = (Formbuilder.options.mappings.EXECUTE_RULE )) == null ? '' : __t) +
'" value="1" />条形码信息收集\r\n    </label>\r\n</div>\r\n<div class="form-group" data-rv-show="model.' +
((__t = ( Formbuilder.options.mappings.EXECUTE_RULE )) == null ? '' : __t) +
' | checked">\r\n    <button type="button" id="codeUp_btn" class="btn btn-primary btn-sm">上传条形码</button>\r\n    <div class="img-container" data-rv-show="model.' +
((__t = ( Formbuilder.options.mappings.IMG_URL )) == null ? '' : __t) +
'">\r\n        <img data-rv-src="model.' +
((__t = ( Formbuilder.options.mappings.IMG_URL )) == null ? '' : __t) +
'" style="width:100%;height:100%;" />\r\n        <div class="img-tags img-remove"  data-counter="single_code">\r\n            <span class="label-holder">\r\n                <span class="label label-danger"><i class="fa fa-remove"></i></span>\r\n            </span>\r\n        </div>\r\n    </div>\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="panel panel-primary">\n    <div class="panel-heading">表单设置</div>\n    <div class="panel-body" id="img-ups">\n        ' +
((__t = ( Formbuilder.templates['edit/base_header']() )) == null ? '' : __t) +
'\n        ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf}) )) == null ? '' : __t) +
'\n    </div>\n</div>\n\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base_header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="form-group">\n    <textarea  class="form-control" style="min-height:30px" placeholder="请输入表单标题" data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.LABEL )) == null ? '' : __t) +
'\' ></textarea>\n</div>\n<div class="form-group">\n    <textarea class="form-control"  rows="3" data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.DESCRIPTION )) == null ? '' : __t) +
'\'  placeholder=\'请输入表单描述\'></textarea>\n</div>\n<div class="form-group">\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.REQUIRED )) == null ? '' : __t) +
'\' />\n    必填\n</div>\n\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = ( Formbuilder.templates['edit/base_header']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf}) )) == null ? '' : __t) +
'\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/multi_img_upload"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="form-group">\r\n    <label class="radio-inline">\r\n        <input type="radio" name="execute_rule" data-rv-checked="model.' +
((__t = (Formbuilder.options.mappings.EXECUTE_RULE )) == null ? '' : __t) +
'" value="0"  />仅拍照\r\n    </label>\r\n    <label class="radio-inline">\r\n        <input type="radio" name="execute_rule" data-rv-checked="model.' +
((__t = (Formbuilder.options.mappings.EXECUTE_RULE )) == null ? '' : __t) +
'"  value="1" />拍照或上传\r\n    </label>\r\n</div>\r\n<div class=\'form-group\'>上传照片</div>\r\n<button class="hide" id="imgUp_route_btn"></button>\r\n<div class=\'form-group option\' data-rv-each-option=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTIONS )) == null ? '' : __t) +
'\'>\r\n    <div>\r\n        <input maxlength="20" class="option-label-input" type="text" data-rv-input="option:label" />\r\n        <button class="btn btn-primary btn-xs img_upload_btn" data-rv-id="option:button_id" >上传图片</button>\r\n        <a href="javascript:void(0)" class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="添加选项"><i class="fa fa-plus-circle"></i></a>\r\n        <a href="javascript:void(0)" class="js-remove-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="删除选项"><i class="fa fa-minus-circle"></i></a>\r\n    </div>\r\n</div>\r\n\r\n<div class=\'form-group\'>\r\n    <a class="btn btn-primary btn-xs js-add-option " href="javascript:void(0)" role="button">增加选项</a>\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/options"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'form-group\'>选项</div>\n<button class="hide" id="imgUp_route_btn"></button>\n<div class=\'form-group option\' data-rv-each-option=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTIONS )) == null ? '' : __t) +
'\'>\n    <div>\n      <input type="checkbox" class=\'js-default-updated\' data-rv-checked="option:checked" />\n      <input type="text" maxlength="20" class=\'option-label-input\' data-rv-input="option:label" />\n      <a href="javascript:void(0)" class="img_upload_btn" title="上传图片"><i class="fa fa-file-image-o"></i></a>\n      <a href="javascript:void(0)" class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="添加选项"><i class="fa fa-plus-circle"></i></a>\n      <a href="javascript:void(0)" class="js-remove-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="删除选项"><i class="fa fa-minus-circle"></i></a>\n    </div>\n</div>\n <div class=\'form-group\'>\n     <a class="btn btn-primary btn-xs js-add-option " href="javascript:void(0)" role="button">增加选项</a>\n </div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/picture"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<button class="hide" id="imgUp_route_btn"></button>\r\n<div class="form-group" >\r\n   <button type="button"  data-counter="single" class="btn btn-primary btn-sm img_upload_btn">上传图片</button>\r\n    <div class="img-container" data-rv-show="model.' +
((__t = ( Formbuilder.options.mappings.IMG_URL )) == null ? '' : __t) +
'">\r\n        <img data-rv-src="model.' +
((__t = ( Formbuilder.options.mappings.IMG_URL )) == null ? '' : __t) +
'" style="width:100%;height:100%;" />\r\n        <div class="img-tags img-remove" data-counter="single">\r\n            <span class="label-holder">\r\n                <span class="label label-danger"><i class="fa fa-remove"></i></span>\r\n            </span>\r\n        </div>\r\n    </div>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/qrcode"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<button class="hide" id="imgUp_route_btn"></button>\r\n<div class="form-group">\r\n    <label class="radio-inline">\r\n        <input type="radio" name="execute_rule" data-rv-checked="model.' +
((__t = (Formbuilder.options.mappings.EXECUTE_RULE )) == null ? '' : __t) +
'" value="0" />二维码信息校验\r\n    </label>\r\n    <label class="radio-inline">\r\n        <input type="radio" name="execute_rule" data-rv-checked="model.' +
((__t = (Formbuilder.options.mappings.EXECUTE_RULE )) == null ? '' : __t) +
'" value="1" />二维码信息收集\r\n    </label>\r\n</div>\r\n<div class="form-group" data-rv-show="model.' +
((__t = ( Formbuilder.options.mappings.EXECUTE_RULE )) == null ? '' : __t) +
' | checked">\r\n    <button type="button" id="codeUp_btn"  class="btn btn-primary btn-sm">上传二维码</button>\r\n    <div class="img-container" data-rv-show="model.' +
((__t = ( Formbuilder.options.mappings.IMG_URL )) == null ? '' : __t) +
'" >\r\n        <img data-rv-src="model.' +
((__t = ( Formbuilder.options.mappings.IMG_URL )) == null ? '' : __t) +
'" style="width:100%;height:100%;" />\r\n        <div class="img-tags img-remove" data-counter="single_code">\r\n            <span class="label-holder">\r\n                <span class="label label-danger"><i class="fa fa-remove"></i></span>\r\n            </span>\r\n        </div>\r\n    </div>\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/video"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="form-group">\r\n    <div class="img-container" data-rv-show="model.' +
((__t = ( Formbuilder.options.mappings.VIDEO_URL )) == null ? '' : __t) +
'">\r\n            视频地址：<label data-rv-html="model.' +
((__t = ( Formbuilder.options.mappings.VIDEO_URL )) == null ? '' : __t) +
'" style="word-wrap:break-word;word-break:break-all;"></label>\r\n    </div>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["page"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n    <div class=\'row\' id="editField" style="margin-left:40px;margin-top: 20px" >\n         ' +
((__t = ( Formbuilder.templates['partials/add_field']() )) == null ? '' : __t) +
'\n        <!--预览表单-->\n        <div class=\'col-xs-6\'>\n            <div class=\'fb-no-response-fields\' >暂无数据</div>\n            <div class=\'fb-response-fields\' ></div>\n        </div>\n        <!--设置元素-->\n        <div class="col-xs-3" >\n            ' +
((__t = ( Formbuilder.templates['partials/edit_field']() )) == null ? '' : __t) +
'\n        </div>\n    </div>\n\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/add_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '    <div class="fb-left-wrapper">\n        <div data-spy="affix"  data-offset-top="100" style="width: 120px;top:20px" >\n            <div class=\'list-group\' id="fb-accordion">\n                <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne"  class="list-group-item active">表单元素&nbsp;<i class="icon-circle-arrow-up"></i></a>\n                <div id="collapseOne" class="fb-edit-add panel-collapse collapse in">\n                  ';
 _.each(_.sortBy(Formbuilder.inputFields, 'order'), function(f){ ;
__p += '\n                    <a href="#" data-field-type="' +
((__t = ( f.field_type )) == null ? '' : __t) +
'" class="list-group-item">' +
((__t = ( f.addButton )) == null ? '' : __t) +
'</a>\n                  ';
 }); ;
__p += '\n                </div>\n            </div>\n            <div class=\'list-group\'>\n              ';
 _.each(_.sortBy(Formbuilder.nonInputFields, 'order'), function(f){ ;
__p += '\n                <a data-field-type="' +
((__t = ( f.field_type )) == null ? '' : __t) +
'">\n                  ' +
((__t = ( f.addButton )) == null ? '' : __t) +
'\n                </a>\n              ';
 }); ;
__p += '\n            </div>\n        </div>\n    </div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/edit_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-field-wrapper\' data-spy="affix"  data-offset-top="100"   >\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["view/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="subtemplate-wrapper">\n  <div class="cover"></div>\n  ' +
((__t = ( Formbuilder.templates['view/label']({rf: rf}) )) == null ? '' : __t) +
'\n  ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf}) )) == null ? '' : __t) +
'\n  ' +
((__t = ( Formbuilder.templates['view/description']({rf: rf}) )) == null ? '' : __t) +
'\n  ' +
((__t = ( Formbuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '';

}
return __p
};

this["Formbuilder"]["templates"]["view/description"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div style="min-height:14px">\n  ' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.DESCRIPTION)) )) == null ? '' : __t) +
'\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/duplicate_remove"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'actions-wrapper\'>\n  <a class="js-duplicate ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="添加"><i class="fa fa-plus-circle"></i></a>\n  <a class="js-clear ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="删除"><i class="fa fa-minus-circle"></i></a>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["view/label"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="view-label">\n  <span>' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.LABEL)) )) == null ? '' : __t) +
':\n      ';
 if (rf.get(Formbuilder.options.mappings.REQUIRED)) { ;
__p += '\n        <span title=\'必填\' style="color:#ff0000">*</span>\n      ';
 } ;
__p += '\n  </span>\n  <span>' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].name || "" )) == null ? '' : __t) +
'</span>\n</div>\n';

}
return __p
};