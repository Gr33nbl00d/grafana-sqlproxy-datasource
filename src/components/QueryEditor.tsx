import React, {Component} from 'react';
import {DataSource} from '../SqlProxyDatasource';
import {QueryEditorProps, DataSourceJsonData} from '@grafana/data';
import {SqlQuery} from 'types';
import {debounce, DebouncedFunc} from "lodash"
import './QueryEditor.scss';
import {TextArea} from '@grafana/ui';

type Props = QueryEditorProps<DataSource, SqlQuery, DataSourceJsonData>;

interface State {
    sql: string;
}

export class QueryEditor extends Component<Props, State> {
    private triggerDebouncedSqlExecution: DebouncedFunc<() => void>;

    constructor(props: QueryEditorProps<DataSource, SqlQuery, DataSourceJsonData>, context: any) {
        super(props, context);
        this.state = {sql: props.query.sql};
        this.triggerDebouncedSqlExecution = debounce(this.triggerSqlExecution, 1000, {leading: false, trailing: true});
    }

    componentDidMount() {
        this.setState({sql: this.props.query.sql});
    }

    private triggerSqlExecution() {
        const sql = this.state.sql;
        this.props.onChange({...this.props.query, sql});
        this.props.onRunQuery(); // executes the query
    }

    render() {
        const {sql} = this.state;
        return (
            <>
                <div className={'sql-query-editor'}>
                    <TextArea
                        value={sql}
                        onChange={event => {
                            this.setState({sql: event.currentTarget.value})
                            this.triggerDebouncedSqlExecution()
                        }
                        }
                    />
                </div>
            </>
        );
    }
}
