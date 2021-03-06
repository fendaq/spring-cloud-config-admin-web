import {OnInit} from '@angular/core'
import {Component, AfterViewInit} from '@angular/core'
import {ScriptLoaderService} from '../../../../_services/script-loader.service'
import {Ajax} from '../../../../shared/ajax/ajax.service'

declare let toastr: any
declare let $: any
declare let swal: any
@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
})
export class ProductCompponent implements AfterViewInit, OnInit {
    formData: any = {
        configServerName: '',
        registryAddress: '',
        name: '',
    }
    dataList: any[] = []
    datatable: any = null
    constructor(private _script: ScriptLoaderService, private ajax: Ajax) {}

    ngOnInit(): void {}

    dataTableInit() {
        var options = {
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '/xhr/project',
                        method: 'GET',
                        params: {},
                        map: function(raw) {
                            // sample data mapping
                            var dataSet = raw
                            if (typeof raw.data !== 'undefined') {
                                dataSet = raw.data
                            }
                            return dataSet
                        },
                    },
                },
                pageSize: 10,
                saveState: {
                    cookie: true,
                    webstorage: true,
                },

                serverPaging: false,
                serverFiltering: false,
                serverSorting: false,
                autoColumns: false,
            },

            layout: {
                theme: 'default',
                class: 'm-datatable--brand',
                scroll: true,
                height: null,
                footer: false,
                header: true,

                smoothScroll: {
                    scrollbarShown: true,
                },

                spinner: {
                    overlayColor: '#000000',
                    opacity: 0,
                    type: 'loader',
                    state: 'brand',
                    message: true,
                },

                icons: {
                    sort: {asc: 'la la-arrow-up', desc: 'la la-arrow-down'},
                    pagination: {
                        next: 'la la-angle-right',
                        prev: 'la la-angle-left',
                        first: 'la la-angle-double-left',
                        last: 'la la-angle-double-right',
                        more: 'la la-ellipsis-h',
                    },
                    rowDetail: {
                        expand: 'fa fa-caret-down',
                        collapse: 'fa fa-caret-right',
                    },
                },
            },

            sortable: true,

            pagination: true,

            search: {
                // enable trigger search by keyup enter
                onEnter: false,
                // input text for search
                input: $('#generalSearch'),
                // search delay in milliseconds
                delay: 200,
            },

            rows: {
                callback: function() {},
                // auto hide columns, if rows overflow. work on non locked columns
                autoHide: false,
            },

            // columns definition
            columns: [
                {
                    field: 'id',
                    title: 'id',
                    width: 80,
                    textAlign: 'center',
                    overflow: 'visible',
                    template: '{{id}}',
                },
                {
                    field: 'name',
                    title: '项目名称',
                    sortable: 'asc',
                    filterable: false,
                    width: 100,
                    responsive: {visible: 'lg'},
                    template: '{{name}}',
                },
                {
                    field: 'envParams',
                    title: '操作',
                    sortable: false,
                    width: 100,
                    overflow: 'visible',
                    template: `<div class="item-operate" data-info={{id}}>
                        <a class="m-portlet__nav-link btn m-btn m-btn--hover-brand m-btn--icon m-btn--icon-only m-btn--pill modifyItem" title="View">
                          <i class="la la-edit"></i>
                        </a>
                        <a class="m-portlet__nav-link btn m-btn m-btn--hover-brand m-btn--icon m-btn--icon-only m-btn--pill deleteItem" title="View">
                          <i class="la la-trash"></i>
                        </a></div>`,
                },
            ],

            toolbar: {
                layout: ['pagination', 'info'],

                placement: ['bottom'], //'top', 'bottom'

                items: {
                    pagination: {
                        type: 'default',

                        pages: {
                            desktop: {
                                layout: 'default',
                                pagesNumber: 6,
                            },
                            tablet: {
                                layout: 'default',
                                pagesNumber: 3,
                            },
                            mobile: {
                                layout: 'compact',
                            },
                        },

                        navigation: {
                            prev: true,
                            next: true,
                            first: true,
                            last: true,
                        },

                        pageSizeSelect: [10, 20, 30, 50, 100],
                    },

                    info: true,
                },
            },

            translate: {
                records: {
                    processing: '正在获取项目列表',
                    noRecords: '当前还没有配置项目',
                },
                toolbar: {
                    pagination: {
                        items: {
                            default: {
                                first: '首页',
                                prev: '上一页',
                                next: '下一页',
                                last: '末页',
                                more: '更多页',
                                input: 'Page number',
                                select: '请选择每页显示数量',
                            },
                            info:
                                '显示第 {{start}} - {{end}} 条记录，总共 {{total}} 条',
                        },
                    },
                },
            },
        }
        let self = this
        this.datatable = (<any>$('#m_datatable')).mDatatable(options)
        $('#m_datatable').on('click', '.deleteItem', event => {
            let id = $(event.target)
                .parents('.item-operate')
                .attr('data-info')
            self.deleteEnv(id)
        })
        $('#m_datatable').on('click', '.modifyItem', event => {
            let id = $(event.target)
                .parents('.item-operate')
                .attr('data-info')
            self.editProduct(id)
        })
    }

    ngAfterViewInit(): void {
        this.dataTableInit()
        this._script.loadScripts('app-env-config', [
            'assets/vendors/custom/datatables/datatables.bundle.js',
            // 'assets/demo/default/custom/crud/datatables/basic/basic.js',
        ])
    }

    async save() {
        if (this.formData.type !== 'edit') {
            try {
                let params = {
                    name: this.formData.name,
                }
                let result = await this.ajax.post('/xhr/project', params)
                toastr.success('新增项目成功!')
                $('#m_modal_1').modal('hide')
                this.datatable.reload()
            } catch (e) {
                toastr.error('新增项目失败!')
            }
        } else {
            try {
                let params = {
                    id: this.formData.id,
                    name: this.formData.name,
                }
                let result = await this.ajax.put('/xhr/project', params)
                toastr.success('更新项目成功!')
                $('#m_modal_1').modal('hide')
                this.datatable.reload()
            } catch (e) {
                toastr.error('更新项目失败!')
            }
        }
    }

    async createProduct() {
        this.formData = {
            name: '',
        }
        $('#m_modal_1').modal('show')
    }

    async editProduct(id) {
        let allData = this.datatable.getColumn(id).originalDataSet
        let result = allData.filter(item => {
            if (item.id == id) {
                return true
            } else {
                return false
            }
        })
        this.formData = {
            id: id,
            name: result[0].name,
            type: 'edit',
        }
        $('#m_modal_1').modal('show')
    }

    async deleteEnv(id) {
        swal({
            title: 'Are you sure?',
            text: '你确定删除这个项目吗？',
            type: 'warning',
            showCancelButton: !0,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }).then(async e => {
            if (e.value) {
                let params = {
                    id: id,
                }
                try {
                    let result = await this.ajax.delete('/xhr/project', params)
                    toastr.success('删除项目成功!')
                    this.datatable.reload()
                } catch (e) {
                    toastr.error('删除项目失败!')
                }
            }
        })
    }
}
